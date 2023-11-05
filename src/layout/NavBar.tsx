import React from 'react';

  const boldText = {
    fontWeight: 'bold',
  };

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-white text-2xl" style={boldText}>Task Manager App</div>
          <ul className="flex space-x-4">
            <li>
              <a href="/" className="text-white hover:text-blue-300 "style={boldText}>Home</a>
            </li>
            <li>
              <a href="/about" className="text-white hover:text-blue-300"style={boldText}>About</a>
            </li>
            <li>
              <a href="/table" className="text-white hover:text-blue-300"style={boldText}>Table Tasks</a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-300"style={boldText}>Instruction</a>
            </li>
            <li>
              <a href="/setting" className="text-white hover:text-blue-300"style={boldText}>Setting</a>
            </li>
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

