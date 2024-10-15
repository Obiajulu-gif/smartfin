// components/Testimonials.js
import { FaStar, FaUserCircle } from 'react-icons/fa';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Okoye Emmanuel',
      business: 'House of Basmati',
      feedback: 'I have been using SmartFin for some time now. Easily the best thing I have done for my business. I’m impressed with how it has made accounting easy for my business.',
    },
    {
      name: 'Ekene Chinwendu',
      business: 'Lofinda Express',
      feedback: 'I am a satisfied customer. I can see a breakdown of my financials immediately after I log in to my dashboard. I always feel like an accountant every time I get my reports. The features are satisfactory as well.',
    },
    {
      name: 'Adebayo Shopade',
      business: 'World Wide Tech',
      feedback: 'SmartFin is an easy-to-use accounting package that has all what you need to run a successful firm.',
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-8 md:px-24 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">What our customers are saying</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 text-left">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500" />
              ))}
            </div>
            <p className="text-gray-600 mb-4">{testimonial.feedback}</p>
            <div className="flex items-center">
              <FaUserCircle className="text-4xl text-gray-500" />
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.business}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
