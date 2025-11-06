import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { GripVertical, X } from "lucide-react";

interface SortableImageProps {
  id: string;
  url: string;
  index: number;
  onRemove: (index: number) => void;
}

export function SortableImage({ id, url, index, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative w-full h-32 rounded-lg overflow-hidden border bg-card group"
    >
      <img
        src={url}
        alt={`Product ${index + 1}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <div className="bg-black/70 rounded p-1">
          <GripVertical className="h-4 w-4 text-white" />
        </div>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>
      {index === 0 && (
        <div className="absolute bottom-2 left-2 bg-wine text-white px-2 py-1 rounded text-xs font-semibold">
          Main Image
        </div>
      )}
    </div>
  );
}
