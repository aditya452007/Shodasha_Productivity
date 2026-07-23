'use client'

import React from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

export interface DraggableItem {
  id: string
  content: React.ReactNode
}

interface DraggableGridProps {
  items: DraggableItem[]
  itemIds: string[]
  onReorder: (newOrder: string[]) => void
}

function SortableGridItem({ id, content }: DraggableItem) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      {/* Drag Handle Overlay */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-4 right-4 z-20 p-1.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shadow-xs"
        title="Drag to reorder section"
      >
        <GripVertical className="size-4" />
      </div>

      {content}
    </div>
  )
}

export function DraggableGrid({ items, itemIds, onReorder }: DraggableGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = itemIds.indexOf(String(active.id))
      const newIndex = itemIds.indexOf(String(over.id))
      const newOrder = arrayMove(itemIds, oldIndex, newIndex)
      onReorder(newOrder)
    }
  }

  // Order items based on itemIds
  const orderedItems = itemIds
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean) as DraggableItem[]

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-8">
          {orderedItems.map((item) => (
            <SortableGridItem key={item.id} id={item.id} content={item.content} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
