"use client";
import { useState } from "react";
import { Rnd } from "react-rnd";

// Define props interface
interface DraggableContactProps {
  onClose: () => void;
}

export default function DraggableContact({ onClose }: DraggableContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
      onClose(); // Close after submission
    }, 2000);
  };

  return (
    <Rnd
      default={{ x: 100, y: 100, width: 350, height: 350 }}
      minWidth={300}
      minHeight={300}
      maxWidth={600}
      maxHeight={500}
      bounds="window"
      dragHandleClassName="drag-handle"
      className="fixed bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 drag-handle cursor-move">
          <h3 className="text-xl font-semibold">Contact Us</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>

        {/* Form (Scrollable Content) */}
        <div className="flex-1 overflow-auto">
          {submitted ? (
            <p className="text-green-500 text-center">Message Sent! ✅</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 flex flex-col">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring focus:ring-blue-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white focus:ring focus:ring-blue-500"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-600 text-white h-20 resize-none focus:ring focus:ring-blue-500 flex-grow"
              ></textarea>

              {/* Send Button Stays Inside */}
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Rnd>
  );
}
