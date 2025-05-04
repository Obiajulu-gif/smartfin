export default function Pricing() {
  const plans = [
    {
      title: 'Basic',
      price: '$19',
      features: ['Up to 100 transactions', 'Email support', 'Basic analytics'],
    },
    {
      title: 'Pro',
      price: '$49',
      features: ['Unlimited transactions', 'Priority email support', 'Advanced analytics'],
    },
    {
      title: 'Enterprise',
      price: 'Custom',
      features: ['All Pro features', 'Dedicated account manager', 'Customized reports'],
    },
  ];

  return (
    <section className="py-16 px-8 md:px-24 bg-white">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8">
        Pricing Plans
      </h2>
      <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.title}
            className="border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {plan.title}
            </h3>
            <p className="text-4xl font-extrabold text-indigo-600 mb-6">
              {plan.price}
            </p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-gray-600">
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300">
              Choose {plan.title}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
