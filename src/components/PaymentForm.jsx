import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatters.js';
import { CreditCard, Smartphone, Building2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export default function PaymentForm({
  amount,
  onSubmitPayment,
  isProcessing = false,
}) {
  const [method, setMethod] = useState('card');
  const [error, setError] = useState('');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // UPI field
  const [upiId, setUpiId] = useState('');

  // Net banking field
  const [selectedBank, setSelectedBank] = useState('HDFC');

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 2) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (method === 'card') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 16) {
        setError('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardName.trim()) {
        setError('Please enter the cardholder name.');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setError('Please enter a valid expiration date (MM/YY).');
        return;
      }
      if (cardCvv.length < 3) {
        setError('Please enter a valid 3-digit CVV.');
        return;
      }
    } else if (method === 'upi') {
      if (!upiId.includes('@') || upiId.length < 4) {
        setError('Please enter a valid UPI ID (e.g., username@bank).');
        return;
      }
    }

    onSubmitPayment({
      paymentMethod: method,
      amount,
      details: {
        method,
        cardLast4: method === 'card' ? cardNumber.slice(-4) : undefined,
        upiId: method === 'upi' ? upiId : undefined,
        bank: method === 'netbanking' ? selectedBank : undefined,
      },
    });
  };

  return (
    <div className="rounded-xl p-6 sm:p-8 bg-[#12111a] border border-white/10 max-w-xl mx-auto space-y-6 font-sans-clean">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-white">Payment Method</h3>
          <p className="text-xs text-slate-400 mt-0.5">Encrypted 256-bit checkout</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Secure</span>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="grid grid-cols-3 gap-2 bg-[#09090e] p-1 rounded-lg border border-white/5">
        <button
          type="button"
          onClick={() => {
            setMethod('card');
            setError('');
          }}
          className={`py-2 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            method === 'card'
              ? 'bg-[#1e1c2a] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Card</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMethod('upi');
            setError('');
          }}
          className={`py-2 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            method === 'upi'
              ? 'bg-[#1e1c2a] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>UPI</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMethod('netbanking');
            setError('');
          }}
          className={`py-2 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            method === 'netbanking'
              ? 'bg-[#1e1c2a] text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Net Banking</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {method === 'card' && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4532 •••• •••• 8890"
                maxLength={19}
                className="w-full px-3 py-2 rounded-lg bg-[#09090e] border border-white/10 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Satoru Gojo"
                className="w-full px-3 py-2 rounded-lg bg-[#09090e] border border-white/10 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  placeholder="08/29"
                  maxLength={5}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090e] border border-white/10 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  className="w-full px-3 py-2 rounded-lg bg-[#09090e] border border-white/10 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {method === 'upi' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                UPI ID (VPA)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okhdfcbank"
                className="w-full px-3 py-2 rounded-lg bg-[#09090e] border border-white/10 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 font-mono focus:outline-none"
              />
            </div>
          </div>
        )}

        {method === 'netbanking' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#09090e] border border-white/10 focus:border-indigo-400 text-xs text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="HDFC">HDFC Bank</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="SBI">State Bank of India</option>
                <option value="AXIS">Axis Bank</option>
              </select>
            </div>
          </div>
        )}

        <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Amount Payable:</span>
          <span className="font-semibold text-sm text-white tabular-nums">
            {formatCurrency(amount)}
          </span>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-lg text-xs font-semibold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-4"
        >
          {isProcessing ? (
            <span>Processing Authorization (2s)...</span>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Authorize & Pay {formatCurrency(amount)}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
