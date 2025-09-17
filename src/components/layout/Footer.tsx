import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '1rem 0', background: '#f5f5f5' }}>
            <span>&copy; {new Date().getFullYear()} Nutricion Web. Todos los derechos reservados.</span>
        </footer>
    );
};

export default Footer;