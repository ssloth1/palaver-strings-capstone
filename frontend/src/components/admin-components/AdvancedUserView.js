import React, { useState } from 'react';
import StudentViewTab from './StudentViewTab';
//import ParentViewTab from './ParentViewTab';
//import InstructorViewTab from './InstructorViewTab';
//import AdminViewTab from './AdminViewTab';

const AdvancedUserView = () => {
    const [activeTab, setActiveTab] = useState('student');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'student':
                return <StudentViewTab />;
            //case 'parent':
                //return <ParentViewTab />;
            //case 'instructor':
                //return <InstructorViewTab />;
            //case 'admin':
                //return <AdminViewTab />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div>
            <nav>
                
            </nav>
            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdvancedUserView;
