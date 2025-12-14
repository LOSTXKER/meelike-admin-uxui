import React from 'react';
import { Card, CardBody } from 'reactstrap';

interface ReportFilterProps {
    children: React.ReactNode;
}

const ReportFilter: React.FC<ReportFilterProps> = ({ children }) => {
    return (
        <Card className="border-none shadow-sm mb-6 bg-white rounded-xl overflow-visible">
            <CardBody className="p-4">
                <div className="flex flex-wrap items-end gap-4">
                    {children}
                </div>
            </CardBody>
        </Card>
    );
};

export default ReportFilter;
