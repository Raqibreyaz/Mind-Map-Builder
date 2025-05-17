import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditNode } from "@/features/workflow/state/use-edit-node";
import {
  EditNodeSchema,
  editNodeSchemaType,
} from "@/features/workflow/schemas/edit-node";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { memo, useCallback, useEffect } from "react";
import { useWorkflowStore } from "../state/use-flow-store";
import { useReactFlow } from "@xyflow/react";

export const EditNodeForm = memo(() => {
  const { open, nodeId, setOpen, setNodeId } = useEditNode();
  const { getNode } = useReactFlow();
  const updateNode = useWorkflowStore((state) => state.updateNode);

  // memoising the node
  const node = getNode(nodeId ?? "");
  const form = useForm<editNodeSchemaType>({
    resolver: zodResolver(EditNodeSchema),
    defaultValues: {
      label: (node?.data.label ?? "") as string, // Fallback to empty string if undefined
      name: (node?.data.name ?? "") as string, // Fallback to empty string
    },
  });

  // update the node
  const onSubmit = useCallback(
    (data: editNodeSchemaType) => {
      updateNode(nodeId, data);
      setOpen(false);
      setNodeId(null);
    },
    [updateNode, setOpen, nodeId]
  );

  useEffect(() => {
    if (node)
      form.reset({
        label: node?.data.label as string,
        name: node.data.name as string,
      });
  }, [node]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Node</SheetTitle>
          <SheetDescription>Edit your node details</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-8"
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Node name" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Node Label</SelectLabel>
                          <SelectItem value="start">Start</SelectItem>
                          <SelectItem value="end">End</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="decision">Decision</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    This label tells what type of node it is
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. buy a coffee" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of the node
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Confirm Edit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
});
