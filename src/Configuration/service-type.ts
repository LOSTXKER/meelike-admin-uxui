export enum ServiceType {
    Default = 'Default',
    Package = 'Package',
    SEO = 'SEO',
    'Custom Comments' = 'Custom Comments',
    Mentions = 'Mentions',
    'Mentions Hashtag' = 'Mentions Hashtag',
    'Comment Likes' = 'Comment Likes',
    Poll = 'Poll',
    'Invite from Groups' = 'Invite from Groups',
    'Subscriptions' = 'Subscriptions',
}

export const ServiceTypeOptions = Object.values(ServiceType).map((type) => ({
    label: type,
    value: type,
}));
