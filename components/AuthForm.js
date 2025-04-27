import { useState } from 'react';

const AuthForm = ({ onSubmit, isRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    hunterName: '',
    username: '',
    hunterClass: 'Warrior'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
          Hunter Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          minLength="6"
        />
      </div>

      {isRegister && (
        <>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="hunterName">
              Hunter Name
            </label>
            <input
              type="text"
              id="hunterName"
              name="hunterName"
              value={formData.hunterName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2" htmlFor="hunterClass">
              Hunter Class
            </label>
            <select
              id="hunterClass"
              name="hunterClass"
              value={formData.hunterClass}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Warrior">Warrior</option>
              <option value="Mage">Mage</option>
              <option value="Assassin">Assassin</option>
              <option value="Tanker">Tanker</option>
              <option value="Healer">Healer</option>
              <option value="Ranger">Ranger</option>
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded font-bold"
      >
        {isRegister ? 'Register as Hunter' : 'Login'}
      </button>
    </form>
  );
};

export default AuthForm;
