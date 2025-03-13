import { Menu, Transition } from '@headlessui/react';
import {
    Bars3Icon,
    ChevronDownIcon,
    ChevronRightIcon,
    CubeIcon,
    HomeIcon,
    ListBulletIcon,
    PencilSquareIcon,
    PercentBadgeIcon,
    PhoneIcon, 
    ShoppingCartIcon,
    TagIcon,
    UserCircleIcon,
    UsersIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { useContext, useState } from 'react';
import { NavLink, Outlet } from 'react-router';
import { AuthContext, AuthContextType } from '../context/AuthContext';
import './AdminLayout.css'; // Import file CSS tùy chỉnh

interface MenuItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children?: MenuItem[];
}

const generateNavigation = (): MenuItem[] => {
    return [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        {
            name: 'Brands',
            href: '/admin/brand',
            icon: TagIcon,
            children: [
                { name: 'List Brands', href: '/admin/brand', icon: ListBulletIcon },
                { name: 'Add Brand', href: '/admin/brand/add', icon: PencilSquareIcon },
            ],
        },
        {
            name: 'Categories',
            href: '/admin/categories',
            icon: ListBulletIcon,
            children: [
                { name: 'List Categories', href: '/admin/categories', icon: ListBulletIcon },
                { name: 'Add Category', href: '/admin/categories/add', icon: PencilSquareIcon },
            ],
        },
        {
            name: 'Products',
            href: '/admin/products',
            icon: CubeIcon,
            children: [
                { name: 'List Products', href: '/admin/products', icon: ListBulletIcon },
                { name: 'Add Product', href: '/admin/products/add', icon: PencilSquareIcon },
            ],
        },
       
        {
            name: 'Discounts',
            href: '/admin/discounts',
            icon: PercentBadgeIcon,
            children: [
                { name: 'List Discounts', href: '/admin/discounts', icon: ListBulletIcon },
                { name: 'Add Discount', href: '/admin/discounts/add', icon: PencilSquareIcon },
            ],
        },
        {
            name: 'Orders',
            href: '/admin/orders',
            icon: ShoppingCartIcon,
            children: [
                { name: 'List Orders', href: '/admin/orders', icon: ListBulletIcon },
            ],
        },
        {
            name: 'Blog',
            href: '/admin/blog',
            icon: PencilSquareIcon,
            children: [
                { name: 'List Blogs', href: '/admin/blog', icon: ListBulletIcon },
                { name: 'Add Blog', href: '/admin/blog/add', icon: PencilSquareIcon },
                { name: 'Categories', href: '/admin/blog-categories', icon: ListBulletIcon },
                { name: 'Add Category', href: '/admin/blog-categories/add', icon: PencilSquareIcon },
            ],
        },
        { name: 'Contact', href: '/admin/contact', icon: PhoneIcon },
        { name: 'Users', href: '/admin/users', icon: UsersIcon }
       
    ];
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const navigation = generateNavigation();
    const { logout } = useContext<AuthContextType>(AuthContext as any);
    const toggleMenuItem = (name: string) => {
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        );
    };
    const handleLogout = () => {
        logout();
    }

    return (
        <div className="flex h-screen bg-gradient-to-r from-gray-50 to-gray-100">
            {/* Sidebar */}
            <div className={classNames(sidebarOpen ? 'translate-x-0' : '-translate-x-full', 'sidebar')}>
                <div className="sidebar-header">
                    <span className="sidebar-header-title">Admin Panel</span>
                    <button onClick={() => setSidebarOpen(false)} className="sidebar-close-button">
                        <XMarkIcon className="h-6 w-6 text-white" />
                    </button>
                </div>
                <nav className="sidebar-nav">
                    {navigation.map((item) => {
                        const isExpanded = expandedItems.includes(item.name);
                        const Icon = item.icon;
                        return (
                            <div key={item.name}>
                                {item.children ? (
                                    <button
                                        onClick={() => toggleMenuItem(item.name)}
                                        className="sidebar-menu-item"
                                    >
                                        <div className="flex items-center">
                                            <Icon className="sidebar-menu-item-icon text-blue-600" />
                                            <span className="sidebar-menu-item-text">{item.name}</span>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronDownIcon className="h-4 w-4 text-blue-600" />
                                        ) : (
                                            <ChevronRightIcon className="h-4 w-4 text-blue-600" />
                                        )}
                                    </button>
                                ) : (
                                    <NavLink
                                        to={item.href}
                                        className={({ isActive }) =>
                                            classNames(
                                                isActive ? 'sidebar-menu-item-active' : '',
                                                'sidebar-menu-item'
                                            )
                                        }
                                    >
                                        <div className="flex items-center">
                                            <Icon className="sidebar-menu-item-icon" />
                                            <span className="sidebar-menu-item-text">{item.name}</span>
                                        </div>
                                    </NavLink>
                                )}
                                {isExpanded && item.children && (
                                    <div className="sidebar-submenu">
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.name}
                                                to={child.href}
                                                className={({ isActive }) =>
                                                    classNames(
                                                        isActive ? 'sidebar-menu-item-active' : '',
                                                        'sidebar-submenu-item' // Sử dụng class mới
                                                    )
                                                }
                                            >
                                                <child.icon className="sidebar-submenu-item-icon" /> {/* Sử dụng class mới */}
                                                <span className="sidebar-submenu-item-text">{child.name}</span> {/* Sử dụng class mới */}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
            {/* Main Content */}
            <div className="main-content">
                <header className="main-header">
                    <button onClick={() => setSidebarOpen(true)} className="main-header-button">
                        <Bars3Icon className="h-6 w-6 text-gray-700 " />
                    </button>
                    <Menu as="div" className="relative">
                        <Menu.Button className="user-menu-button ">
                            <UserCircleIcon className="h-8 w-8 text-gray-500" />
                            <span className="text-gray-700">Admin</span>
                        </Menu.Button>
                        <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-in"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            <Menu.Items className="user-menu-items">
                                <Menu.Item>
                                    {({ active }) => (
                                        <NavLink
                                            to="/"
                                            className="user-menu-item"
                                        >
                                            Trang chủ
                                        </NavLink>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <NavLink
                                            to="#"
                                            onClick={handleLogout}
                                            className="user-menu-item"
                                        >
                                            Logout
                                        </NavLink>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </header>
                <main className="main-content-body">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};