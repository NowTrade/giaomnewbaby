"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/lib/user-context';

const AddPayment = () => {
  const { user } = useUser();
  const [paymentMethods, setPaymentMethods] = useState([
    { id: Date.now(), cardNumber: '', expiryDate: '', cvv: '', cardHolderName: '', submitted: false },
  ]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [methodToRemove, setMethodToRemove] = useState<number | null>(null);

  const handleAddMethod = () => {
    setPaymentMethods((prev) => [
      ...prev,
      { id: Date.now(), cardNumber: '', expiryDate: '', cvv: '', cardHolderName: '', submitted: false },
    ]);
  };

  const handleRemoveMethod = () => {
    if (methodToRemove !== null) {
      setPaymentMethods((prev) => prev.filter((method) => method.id !== methodToRemove));
      setShowConfirmDialog(false);
      setMethodToRemove(null);
    }
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, [field]: value } : method))
    );
  };

  const handleSubmit = async (id: number) => {
    const method = paymentMethods.find((method) => method.id === id);
    if (!method) return;

    const payload = {
      card_number: method.cardNumber,
      expiry_date: method.expiryDate,
      card_holder_name: method.cardHolderName,
      user_id: user.id, // Use user from context
    };

    console.log('Payload being sent to Supabase:', payload);

    const { data, error } = await supabase.from('payment_methods').insert([payload]);

    if (error) {
      console.error('Error saving payment method:', error);
      console.error('Supabase error details:', error.message, error.details);
      return;
    }

    console.log('Payment method saved successfully:', data);

    setPaymentMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, submitted: true } : m))
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl p-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Add Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {paymentMethods.map((method, index) => (
              <div key={method.id} className="relative border p-4 rounded-md space-y-4">
                {method.submitted ? (
                  <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                    <span>**** **** **** {method.cardNumber.slice(-4)}</span>
                    <span>{method.cardHolderName}</span>
                  </div>
                ) : (
                  <>
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowConfirmDialog(true);
                          setMethodToRemove(method.id);
                        }}
                      >
                        -
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor={`cardNumber-${index}`}>Card Number</Label>
                      <Input
                        type="text"
                        id={`cardNumber-${index}`}
                        value={method.cardNumber}
                        onChange={(e) => handleInputChange(method.id, 'cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <Label htmlFor={`expiryDate-${index}`}>Expiry Date</Label>
                        <Input
                          type="text"
                          id={`expiryDate-${index}`}
                          value={method.expiryDate}
                          onChange={(e) => handleInputChange(method.id, 'expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={`cvv-${index}`}>CVV</Label>
                        <Input
                          type="text"
                          id={`cvv-${index}`}
                          value={method.cvv}
                          onChange={(e) => handleInputChange(method.id, 'cvv', e.target.value)}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`cardHolderName-${index}`}>Cardholder Name</Label>
                      <Input
                        type="text"
                        id={`cardHolderName-${index}`}
                        value={method.cardHolderName}
                        onChange={(e) => handleInputChange(method.id, 'cardHolderName', e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      className="w-full mt-4"
                      onClick={() => handleSubmit(method.id)}
                    >
                      Submit Payment Method
                    </Button>
                  </>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={handleAddMethod} className="w-full">
              + Add Another Method
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p>Do you really want to remove this payment method?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMethod}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPayment;