import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEditNode } from '@/features/workflow/state/use-edit-node';
import {
  EditNodeSchema,
  editNodeSchemaType,
} from '@/features/workflow/schemas/edit-node';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { memo, useCallback, useEffect } from 'react';
import { useWorkflowStore } from '../state/use-flow-store';
import { useReactFlow } from '@xyflow/react';
import { getAllShapes, getShapeConfig, getAllStickers, getStickerConfig } from '@/features/workflow/constants/shape-config';
import { ShapeType, StickerType } from '@/features/workflow/constants/shape-config';

export const EditNodeForm = memo(() => {
  const { open, nodeId, setOpen, setNodeId } = useEditNode();
  const { getNode } = useReactFlow();
  const updateNode = useWorkflowStore((state) => state.updateNode);

  const node = getNode(nodeId ?? '');
  const form = useForm<editNodeSchemaType & { shapeType?: ShapeType; sticker?: StickerType | null; customColor?: string | null }>({
    resolver: zodResolver(EditNodeSchema),
    defaultValues: {
      label: (node?.data.label ?? '') as string,
      name: (node?.data.name ?? '') as string,
      shapeType: (node?.data.shapeType ?? 'rectangle') as ShapeType,
      sticker: (node?.data.sticker ?? null) as StickerType | null,
      customColor: (node?.data.customColor ?? null) as string | null,
    },
  });

  const onSubmit = useCallback(
    (data: any) => {
      updateNode(nodeId, {
        ...data,
        shapeType: data.shapeType || 'rectangle',
      });
      setOpen(false);
      setNodeId(null);
    },
    [updateNode, setOpen, nodeId, setNodeId]
  );

  useEffect(() => {
    if (node) {
      form.reset({
        label: node?.data.label as string,
        name: node.data.name as string,
        shapeType: (node?.data.shapeType ?? 'rectangle') as ShapeType,
        sticker: (node?.data.sticker ?? null) as StickerType | null,
        customColor: (node?.data.customColor ?? null) as string | null,
      });
    }
  }, [node, form]);

  const shapes = getAllShapes();
  const stickers = getAllStickers();
  const selectedShape = form.watch('shapeType') as ShapeType;
  const selectedSticker = form.watch('sticker') as StickerType | null;
  // const selectedColor = form.watch('customColor') as string | null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Node</SheetTitle>
          <SheetDescription>Customize your architectural component</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
            {/* Node Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Node Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. User Service" {...field} />
                  </FormControl>
                  <FormDescription>Custom name for this component</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shape Type */}
            <FormField
              control={form.control}
              name="shapeType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shape Type</FormLabel>
                  <FormControl>
                    <Select value={field.value || 'rectangle'} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Architectural Shapes</SelectLabel>
                          {shapes.map((shape) => {
                            const config = getShapeConfig(shape);
                            return (
                              <SelectItem key={shape} value={shape}>
                                <span>{config.icon} {config.name}</span>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {selectedShape && getShapeConfig(selectedShape as ShapeType).description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sticker Selection */}
            <FormField
              control={form.control}
              name="sticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sticker Badge (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ''}
                      onValueChange={(value) => field.onChange(value || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sticker or none" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="">None</SelectItem>
                          <SelectLabel>Stickers</SelectLabel>
                          {stickers.map((sticker) => {
                            const config = getStickerConfig(sticker);
                            return (
                              <SelectItem key={sticker} value={sticker}>
                                <span>{config.icon} {config.name}</span>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {selectedSticker ? getStickerConfig(selectedSticker as StickerType).description : 'Optional icon badge'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Color */}
            <FormField
              control={form.control}
              name="customColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Color (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={field.value || '#FFFFFF'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <Input
                        placeholder="#000000"
                        value={field.value || ''}
                        onChange={field.onChange}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => field.onChange(null)}
                        className="text-xs"
                      >
                        Reset
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Override the default shape color (leave empty to use default)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
});

EditNodeForm.displayName = 'EditNodeForm';
