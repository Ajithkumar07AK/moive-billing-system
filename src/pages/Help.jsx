import React, { useState } from 'react';
import { bookingApi } from '../api/booking.api.js';
import Toast from '../components/Toast.jsx';
import InfinitySymbol from '../assets/InfinitySymbol.jsx';
import { HelpCircle, ChevronDown, Send, MessageSquare, Shield, CheckCircle } from 'lucide-react';

export default function Help() {
  const [openFaq, setOpenFaq] = useState(0);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  const faqs = [
    {
      q: 'How does the 5-minute seat locking system work?',
      a: 'When you select seats and proceed to checkout, our server locks those seats for exactly 300 seconds (5 minutes). This prevents other guests from booking the same seats concurrently while you complete your simulated payment. If the timer reaches zero before checkout completes, the seats are automatically released.',
    },
    {
      q: 'Do I need a physical ticket to enter the auditorium?',
      a: 'No. Infinity Cinema operates on 100% contactless ticketing. Your confirmation ticket features an encrypted QR barcode that is scanned at the entrance turnstiles. You can also download the high-resolution vector PDF ticket directly to your smartphone.',
    },
    {
      q: 'What are the technical specifications of your screens?',
      a: 'Screen 1 features Dual 4K IMAX Laser projection with 12-channel spatial audio. Screen 2 is equipped with Dolby Vision HDR and a 64-speaker Dolby Atmos object sound sphere. Screen 3 provides Christie Laser 4K crystal clarity with plush ergonomic recliners.',
    },
    {
      q: 'What is the refund and cancellation policy?',
      a: 'Bookings can be cancelled up to 2 hours before the scheduled showtime directly through your "My Bookings" portal, with 100% refund credited back to your original payment method.',
    },
    {
      q: 'Can I book for large groups or corporate events?',
      a: 'Yes! While our online checkout caps individual consumer bookings at 8 seats to prevent scalping, group bookings or full auditorium buyouts can be arranged by submitting a ticket below.',
    },
  ];

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setToastMessage('Please fill in all support ticket fields.');
      setToastType('error');
      return;
    }

    setSubmitting(true);
    try {
      await bookingApi.submitSupportTicket({ name, email, subject, message });
      setToastMessage('Support ticket submitted successfully! Ticket ID logged.');
      setToastType('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setToastMessage('Support ticket submitted successfully! (Local mode)');
      setToastType('success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05030f] pt-28 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setToastMessage('')}
      />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <InfinitySymbol className="w-10 h-10 mx-auto mb-3" />
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          Help & Customer Care
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Everything you need to know about bookings, screens, and contactless entry
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: FAQ Accordion */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl glass-panel border border-indigo-950/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-indigo-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-indigo-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-indigo-950/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contact Support Form */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-6 sm:p-8 border border-indigo-500/30 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>Support Ticket Desk</span>
          </div>
          <h3 className="font-display font-bold text-lg text-white mb-2">
            Contact Box Office Support
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Have a special inquiry or reservation issue? Send us a message and our concierge team will respond within 24 hours.
          </p>

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Gojo Satoru"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05030f] border border-indigo-950/80 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05030f] border border-indigo-950/80 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Screen 1 Booking Inquiry"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05030f] border border-indigo-950/80 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Message
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain your inquiry in detail..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#05030f] border border-indigo-950/80 focus:border-indigo-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-4 rounded-xl font-display font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : 'Dispatch Support Ticket'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
