import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditNode } from "@/features/workflow/state/use-edit-node";
import {
  EditNodeSchema,
  editNodeSchemaType,
} from "@/features/workflow/schemas/edit-node";
import { useReactFlow } from "@xyflow/react";
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
import { memo, useCallback, useMemo } from "react";

export const EditNodeForm = memo(() => {
  const { open, nodeId, setOpen, setNodeId } = useEditNode();
  const { getNode, setNodes } = useReactFlow();

  // memoising the node
  const node = useMemo(() => getNode(nodeId ?? ""), [nodeId, getNode]);
  const form = useForm<editNodeSchemaType>({
    defaultValues: {
      label: node?.data.label as string,
      execution_time: node?.data.execution_time as number,
    },
    resolver: zodResolver(EditNodeSchema),
  });

  // update the node
  const onSubmit = useCallback(
    (data: editNodeSchemaType) => {
      setNodes((prevNodeState) =>
        prevNodeState.map((prevNode) =>
          prevNode.id === nodeId
            ? { ...prevNode, data: { ...prevNode.data, ...data } }
            : prevNode
        )
      );
      setOpen(false);
      setNodeId(null);
    },
    [setNodes, setOpen, nodeId]
  );

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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
            <FormField
              control={form.control}
              name="execution_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Execution Time</FormLabel>
                  <FormControl>
                    <Input placeholder="eg. 10" type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the Execution time of your Node
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
