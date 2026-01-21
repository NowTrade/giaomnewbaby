import Link from 'next/link';

const CustomerSidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link href="/profile/customer">Dashboard</Link>
          </li>
          <li>
            <Link href="/profile/customer/buy-history">Recent Buys</Link>
          </li>
          {/* Add other navigation links here */}
        </ul>
      </nav>
    </aside>
  );
};

export default CustomerSidebar;