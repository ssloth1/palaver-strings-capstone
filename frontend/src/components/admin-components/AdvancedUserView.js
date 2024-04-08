import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaUserTie, FaChalkboardTeacher, FaUserShield } from 'react-icons/fa';
import './styles/AdvancedUserView.css';
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
        <div className="tabs-container">
            <nav className="tabs-nav">
                <button onClick={() => handleTabClick('student')} className={`tab-button ${activeTab === 'student' ? 'active' : ''}`}><FaUserGraduate /> Students</button>
                <button onClick={() => handleTabClick('parent')} className={`tab-button ${activeTab === 'parent' ? 'active' : ''}`}><FaUserTie /> Parents</button>
                <button onClick={() => handleTabClick('instructor')} className={`tab-button ${activeTab === 'instructor' ? 'active' : ''}`}><FaChalkboardTeacher /> Instructors</button>
                <button onClick={() => handleTabClick('admin')} className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}><FaUserShield /> Admins</button>
            </nav>
            <div className="tab-content">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdvancedUserView;