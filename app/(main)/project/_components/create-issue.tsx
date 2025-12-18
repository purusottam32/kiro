"use client";

import React, { useEffect } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { issueSchema } from '@/app/lib/validators';
import { createIssue } from '@/actions/issues';
import { getOrganizationUsers } from '@/actions/organizations';
import useFetch from '@/hooks/use-fetch';
import userLoading from '@/components/user-loading';
import { BarLoader } from 'react-spinners';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MDEditor from "@uiw/react-md-editor";

type IssueCreationDrawerProps = {
    isOpen: boolean;
    onClose: () => void;
    sprintId?: string | null;
    status: string;
    projectId: string;
    onIssueCreated: () => void;
    orgId: string;
};


const issueCreationDrawer: React.FC<IssueCreationDrawerProps> = ({ isOpen, onClose, sprintId, status, projectId, onIssueCreated, orgId }) => {
    const {
        loading: createIssueLoading,
        fn: createIssueFn,
        error,
        data: newIssue,
    } = useFetch(createIssue);

    const {
        loading: usersLoading,
        fn: fetchUsers,
        data: users,
    } = useFetch(getOrganizationUsers);
    useEffect(() => {
        fetchUsers(orgId);
    }, [isOpen, orgId]);
    const onSubmit = async (data: any) => {

    }
    const { control, register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(issueSchema),
        defaultValues: {
            priority: "MEDIUM",
            description: "",
            assigneeId: "",
        },
    })
    return (
        <Drawer open={isOpen} onClose={onClose}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Issue</DrawerTitle>
                </DrawerHeader>
                {usersLoading && <BarLoader width="100%" color="#368d7b7" />}
                <form className='p-4 space-y-4'>
                    <div>
                        <label htmlFor="title" className='block text-sm font-medium mb-1'>Title</label>
                        <Input id="title"{...register("title")} />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="assigneeId" className='block text-sm font-medium mb-1'>Assignee</label>
                        <Controller
                            name="assigneeId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select assignee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users?.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                {user?.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.assigneeId && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.assigneeId.message}
                            </p>
                        )}
                    </div>
                                
                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium mb-1"
                        >
                        Description
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <MDEditor value={field.value} onChange={field.onChange} />
                            )}
                        />
                    </div>
                </form>
            </DrawerContent>
        </Drawer>
    )
}

export default issueCreationDrawer