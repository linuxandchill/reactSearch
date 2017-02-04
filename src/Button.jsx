import React from 'react';

const Button = ({onClick,className ='',children}) => 
<div>
  <button 
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>
</div>

export default Button;
