import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const priority = searchParams.get("priority");
  const category = searchParams.get("category");
  const clientId = searchParams.get("clientId");

  const where: any = {};
  if (status && status !== "ALL") where.status = status;
  if (priority && priority !== "ALL") where.priority = priority;
  if (category && category !== "ALL") where.category = category;
  if (clientId && clientId !== "ALL") where.clientId = clientId;

  const tasks = await db.task.findMany({
    where,
    include: {
      client: {
        select: {
          id: true,
          name: true,
          clientCode: true,
          pan: true,
        },
      },
      assignedTo: {
        select: {
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, clientId, priority, category, dueDate } = body;

    if (!title || !dueDate || !category) {
      return NextResponse.json(
        { error: "Title, Category, and Due Date are required fields." },
        { status: 400 }
      );
    }

    const task = await db.task.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        clientId: clientId && clientId !== "NONE" ? clientId : null,
        assignedToId: session.adminId,
        priority: priority || "MEDIUM",
        category,
        dueDate: new Date(dueDate),
        status: "TODO",
      },
      include: {
        client: { select: { name: true, pan: true } },
      },
    });

    await db.auditLog.create({
      data: {
        adminId: session.adminId,
        action: "TASK_CREATE",
        module: "TASK",
        recordId: task.id,
        diff: `Created task '${task.title}' [Category: ${task.category}, Priority: ${task.priority}]`,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    console.error("Task creation error:", error);
    return NextResponse.json({ error: error.message || "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, status, priority, dueDate } = body;

    if (!id) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (status) {
      updateData.status = status;
      if (status === "COMPLETED") {
        updateData.completedAt = new Date();
      } else {
        updateData.completedAt = null;
      }
    }
    if (priority) updateData.priority = priority;
    if (dueDate) updateData.dueDate = new Date(dueDate);

    const task = await db.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ task });
  } catch (error: any) {
    console.error("Task update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update task" }, { status: 500 });
  }
}
