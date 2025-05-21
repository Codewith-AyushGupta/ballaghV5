import React from 'react';
import { useLocation } from 'react-router-dom';
import SingleColumnTabView from './Tabs/SingleColumnTabView';
import ThreeColumnImageView from './Tabs/ThreeColumnImageTabView';
import ThreeColumnTabView from './Tabs/ThreeColumnTabView';
import FourColumnImageTabView from './Tabs/FourColumnImageTabView';
import SinglePropertyTabView from './Tabs/SinglePropertyTabView';

function MainMenu(props) {
    const Pathname = useLocation().pathname;
    return (
        <nav className="main-nav">
            <ul className="menu menu-active-underline">
                {Object.values(props).map((HeaderMenuItem, index) => (
                    HeaderMenuItem.tabType === 'SinglePropertyTabView' && HeaderMenuItem.isActive ? (
                        <SinglePropertyTabView
                            key={index}
                            Pathname={Pathname}
                            HeaderMenuItem={HeaderMenuItem}
                        />
                    ) : HeaderMenuItem.tabType === 'SingleColumnTabView' && HeaderMenuItem.isActive ? (
                        <SingleColumnTabView
                            key={index}
                            Pathname={Pathname}
                            HeaderMenuItem={HeaderMenuItem}
                        />
                    ) : HeaderMenuItem.tabType === 'ThreeColumnImageView' && HeaderMenuItem.isActive ? (
                        <ThreeColumnImageView
                            key={index}
                            Pathname={Pathname}
                            HeaderMenuItem={HeaderMenuItem}
                        />
                    ) : HeaderMenuItem.tabType === 'ThreeColumnTabView' && HeaderMenuItem.isActive ? (
                        <ThreeColumnTabView
                            key={index}
                            Pathname={Pathname}
                            HeaderMenuItem={HeaderMenuItem}
                        />
                    ) : HeaderMenuItem.tabType === 'FourColumnImageTabView' && HeaderMenuItem.isActive ? (
                        <FourColumnImageTabView
                            key={index}
                            Pathname={Pathname}
                            HeaderMenuItem={HeaderMenuItem}
                        />
                    ) : (
                        ''
                    )
                ))}
            </ul>
        </nav>
    );
}

export default MainMenu;
