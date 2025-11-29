"use client";

import { useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
}

interface KanbanBoardProps {
  issues: Issue[];
  onUpdateIssue: (id: string, newStatus: string) => void;
}

const COLUMNS = ["Backlog", "In Progress", "Done"];

function SortableItem({ issue }: { issue: Issue }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id, data: { type: "Issue", issue } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "#1f2937",
        padding: "1rem",
        margin: "0.5rem 0",
        borderRadius: "4px",
        border: "1px solid #374151",
        cursor: "grab",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      }}
      {...attributes}
      {...listeners}
    >
      <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", fontWeight: 600, color: "white" }}>{issue.title}</h4>
      {issue.description && (
        <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "#d1d5db", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {issue.description}
        </p>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#d1d5db" }}>
        <span>{issue.priority}</span>
      </div>
    </div>
  );
}

export default function KanbanBoard({ issues, onUpdateIssue }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5, // Minimum drag distance before activation
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group issues by status
  const columns = useMemo(() => {
    const cols: Record<string, Issue[]> = {
      "Backlog": [],
      "In Progress": [],
      "Done": [],
    };
    
    issues.forEach((issue) => {
      if (cols[issue.status]) {
        cols[issue.status].push(issue);
      } else {
        // Handle unknown status by putting in Backlog or creating new col
        if (!cols["Backlog"]) cols["Backlog"] = [];
        cols["Backlog"].push(issue);
      }
    });
    return cols;
  }, [issues]);

  function onDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveIssue(active.data.current?.issue as Issue);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) return;

    const activeIssueId = active.id as string;
    const overId = over.id as string;
    
    // Determine the new status
    // If dropping over a container (column) directly
    let newStatus = "";
    
    if (COLUMNS.includes(overId)) {
        newStatus = overId;
    } else {
        // Dropping over another item? Find its status
        const overIssue = issues.find(i => i.id === overId);
        if (overIssue) {
            newStatus = overIssue.status;
        }
    }

    if (newStatus && activeIssue?.status !== newStatus) {
        onUpdateIssue(activeIssueId, newStatus);
    }

    setActiveId(null);
    setActiveIssue(null);
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div style={{ display: "flex", gap: "1.5rem", overflowX: "auto", paddingBottom: "1rem" }}>
        {COLUMNS.map((columnId) => (
          <div
            key={columnId}
            style={{
              background: "#374151",
              border: "1px solid #1f2937",
              borderRadius: "8px",
              padding: "1rem",
              minWidth: "280px",
              width: "280px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "bold", color: "white" }}>
              {columnId} <span style={{ color: "#d1d5db", fontWeight: "normal" }}>({columns[columnId]?.length || 0})</span>
            </h3>
            
            <SortableContext
              id={columnId}
              items={columns[columnId]?.map((i) => i.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ minHeight: "100px" }}>
                {columns[columnId]?.map((issue) => (
                  <SortableItem key={issue.id} issue={issue} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeIssue ? (
           <div
           style={{
             background: "#1f2937",
             padding: "1rem",
             borderRadius: "4px",
             border: "1px solid #374151",
             boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
             width: "280px" // Match column width roughly
           }}
         >
           <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", fontWeight: 600, color: "white" }}>{activeIssue.title}</h4>
           {activeIssue.description && (
             <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "#d1d5db", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
               {activeIssue.description}
             </p>
           )}
           <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#d1d5db" }}>
             <span>{activeIssue.priority}</span>
           </div>
         </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

