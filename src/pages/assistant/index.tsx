import { useEffect, useState } from "react";
import { NextPage } from "next";
import { AssistantList, EditAssistant } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import assistantStore from "@/utils/assistantStore";
import { notifications } from "@mantine/notifications";
import { ASSISTANT_INIT } from "@/utils/constant";
import Link from "next/link";
import { ActionIcon, Card, Text, Group, Drawer, Badge } from "@mantine/core";
import { IconChevronLeft, IconUserPlus, IconPencil, IconUser } from "@tabler/icons-react";
import { AssistantConfig } from "@/components/AssistantConfig";


const showNotification = (message: string) => {
    notifications.show({
        id: 'Success',
        title: 'Success',
        message,
        color: 'green',
        autoClose: 3000
    });
};

const Assistant: NextPage = () => {
    // 獲取助理列表
    const [ assistantList, setAssistantList ] = useState<AssistantList>([]);

    const [opened, drawerHandler] = useDisclosure(false);

    const [ editAssistant, setEditAssistant ] = useState<EditAssistant>();

    useEffect(() => {
        const list = assistantStore.getList();
        setAssistantList(list);
    }, []);
    
    const saveAssistant = (data: EditAssistant) => {
        if (data.id) {
            let newAssistantList = assistantStore.updateAssistant(data.id, data);
            setAssistantList(newAssistantList);
        } else {
            const newAssistant = {
                ...data,
                id: Date.now().toString()
            };
            let newAssistantList = assistantStore.addAssistant(newAssistant);
            setAssistantList(newAssistantList);
        }
        showNotification('保存成功');
        drawerHandler.close();
    };
    
    const removeAssistant = (id: string) => {
        let newAssistantList = assistantStore.removeAssistant(id);
        setAssistantList(newAssistantList);
        showNotification('刪除成功');
        drawerHandler.close();
    };

    const onEditAssistant = (data: EditAssistant) => {
        setEditAssistant(data);
        drawerHandler.open();
    };


    const onAddAssistant = () => {
        const newAssistant = {
            ...ASSISTANT_INIT[0],
            // overwrite
            name: `助理_${assistantList.length + 1}號`
        };
        setEditAssistant(newAssistant);
        drawerHandler.open();
    };


    return (
        <div className="h-screen flex flex-col">
             {/* header */}
             <div className="flex justify-between p-4 shadow-sm">
                {/* left */}
                <Link href='/'>
                    <ActionIcon>
                        <IconChevronLeft />
                    </ActionIcon>
                </Link>
                {/* middle */}
                <Text weight={500} size="lg">
                    Jomunn AI助理
                </Text>
                {/* right */}
                <ActionIcon onClick={ onAddAssistant }>
                    <IconUserPlus></IconUserPlus>
                </ActionIcon>
             </div>
             {/* body */}
             <div className="flex gap-8 flex-wrap p-4 overflow-y-auto mx-auto">
                {
                    assistantList.map((item) => {
                        return (
                            <Card key={ item.id } 
                                shadow="sm"
                                padding="lg"
                                radius="md"
                                className="w-full max-w-sm group transition-all duration-300"
                            >
                                {/* top */}
                                <Text weight={500} className="line-clamp-1">{ item.name }</Text>
                                {/* middle */}
                                <Text size="sm" color="dimmed" className="line-clamp-3 mt-2">
                                    { item.prompt }
                                </Text>
                                {/* bottom */}
                                <Group className="mt-4 flex items-center">
                                    <Group>
                                        <Badge size="md" color="green" radius="sm">
                                            Token: { item.max_tokens }
                                        </Badge>
                                        <Badge size="md" color="blue" radius="sm">
                                            Temp: { item.temperature }
                                        </Badge>
                                        <Badge size="md" color="cyan" radius="sm">
                                            Logs: { item.max_log }
                                        </Badge>
                                    </Group>
                                    <Group className="w-full flex justify-end items-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                                        <ActionIcon size="sm" onClick={ () => { onEditAssistant(item) } }>
                                            <IconPencil />
                                        </ActionIcon>
                                    </Group>
                                </Group>
                            </Card>
                        );
                    })
                }
             </div>
             {/* drawer */}
             <Drawer opened={opened} onClose={drawerHandler.close} size="lg" position="right">
                <AssistantConfig 
                    assistant={editAssistant!}
                    save={saveAssistant}
                    remove={removeAssistant}
                />
             </Drawer>
        </div>
    );
};

export default Assistant;