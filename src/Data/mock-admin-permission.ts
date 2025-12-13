export const permissionsMockData = [
    {
        module: 'CLIENT_MANAGEMENT',
        label: 'Client Management',
        actions: [
            { code: 'VIEW_ONLY', label: 'View Only' },
            { code: 'CREATE', label: 'Create' },
            { code: 'EDIT_CLIENT', label: 'Edit Client' },
            { code: 'DELETE', label: 'Delete' },
        ],
    },
    {
        module: 'SOFTWARE_DEPLOYMENT',
        label: 'Software Deployment',
        actions: [
            { code: 'VIEW_ONLY', label: 'View Only' },
            { code: 'CREATE', label: 'Create' },
            { code: 'EDIT', label: 'Edit' },
            { code: 'DELETE', label: 'Delete' },
            { code: 'PACKING', label: 'Packing' },
        ],
    },
    {
        module: 'SOFTWARE_LICENSE_CONTROL',
        label: 'Software & License Control',
        actions: [
            { code: 'VIEW_ONLY', label: 'View Only' },
            { code: 'CANCEL', label: 'Cancel' },
            { code: 'DOWNLOAD', label: 'Download' },
        ],
    },
    {
        module: 'ARCHIVE',
        label: 'Archive',
        actions: [{ code: 'VIEW_ONLY', label: 'View Only' }],
    },
    {
        module: 'ADMIN_MANAGEMENT',
        label: 'Admin Management',
        actions: [
            { code: 'VIEW_ONLY', label: 'View Only' },
            { code: 'CREATE', label: 'Create' },
            { code: 'EDIT_CLIENT', label: 'Edit Client' },
            { code: 'DELETE', label: 'Delete' },
        ],
    },
];

export const transformApiResponseToPermissions = (apiResponse: any[]): any[] => {
    const groupedPermissions = apiResponse.reduce((acc, permission) => {
        const [moduleName, actionLabel] = permission.name.split(' - ');
        const moduleCode = permission.permissionCode.split('_')[0];
        const actionCode = permission.permissionCode;

        if (!acc[moduleCode]) {
            acc[moduleCode] = {
                module: moduleCode,
                label: moduleName,
                actions: [],
            };
        }

        acc[moduleCode].actions.push({
            code: actionCode,
            label: actionLabel,
        });

        return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedPermissions);
};
