import React, { useState } from 'react';
import StudentViewTab from './StudentViewTab';
import ParentViewTab from './ParentViewTab';
import InstructorViewTab from './InstructorViewTab';
import AdminViewTab from './AdminViewTab';

const AdvancedUserView = () => {
    const [activeTab, setActiveTab] = useState('student');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'student':
                return <StudentViewTab />;
            case 'parent':
                return <ParentViewTab />;
            case 'instructor':
                return <InstructorViewTab />;
            case 'admin':
            return <AdminViewTab />;
            default:
                return <div>Select a tab</div>;
        }
    };

    return (
        <div>
            <nav style={{ marginBottom: '20px' }}>
                <button onClick={() => handleTabClick('student')} style={{ marginRight: '10px', padding: '10px', background: activeTab === 'student' ? 'lightgrey' : 'white' }}>Students</button>
                <button onClick={() => handleTabClick('parent')} style={{ marginRight: '10px', padding: '10px', background: activeTab === 'parent' ? 'lightgrey' : 'white' }}>Parents</button>
                <button onClick={() => handleTabClick('instructor')} style={{ marginRight: '10px', padding: '10px', background: activeTab === 'instructor' ? 'lightgrey' : "white" }}>Instructors</button>
                <button onClick={() => handleTabClick('admin')} style={{ marginRight: '10px', padding: '10px', background:activeTab === 'admin' ? 'lightgrey' : 'white' }}>Admins</button>
            </nav>
            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdvancedUserView;