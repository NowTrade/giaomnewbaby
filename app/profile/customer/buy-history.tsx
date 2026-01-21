import React from 'react';
import { useUser } from '@/lib/user-context';
import { supabase } from '@/lib/supabase';

interface BuyHistoryItem {
  id: string;
  product_name: string;
  price: number;
  purchase_date: string;
}

const BuyHistory = () => {
  const { user } = useUser();
  const [history, setHistory] = React.useState<BuyHistoryItem[]>([]);

  React.useEffect(() => {
    if (user) {
      fetchBuyHistory();
    }
  }, [user]);

  const fetchBuyHistory = async () => {
    const { data, error } = await supabase
      .from('buy_history')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching buy history:', error);
    } else {
      setHistory(data as BuyHistoryItem[]);
    }
  };

  return (
    <div>
      <h1>Buy History</h1>
      {history.length > 0 ? (
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              <p>Product: {item.product_name}</p>
              <p>Price: ${item.price}</p>
              <p>Date: {new Date(item.purchase_date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No purchase history available.</p>
      )}
    </div>
  );
};

export default BuyHistory;