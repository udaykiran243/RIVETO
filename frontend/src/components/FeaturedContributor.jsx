import React from 'react';
import { motion } from 'framer-motion';

const FeaturedContributor = ({ contributor, role, description, badge, rank = 1 }) => {
    // Podium heights based on rank
    const podiumStyles = {
        1: { height: 'min-h-[450px]', avatarSize: 'w-40 h-40', badgeSize: 'text-3xl', accentColor: '#FFD700' }, // Gold - tallest
        2: { height: 'min-h-[400px]', avatarSize: 'w-36 h-36', badgeSize: 'text-2xl', accentColor: '#C0C0C0' }, // Silver - medium
        3: { height: 'min-h-[350px]', avatarSize: 'w-32 h-32', badgeSize: 'text-xl', accentColor: '#CD7F32' }  // Bronze - shortest
    };

    const style = podiumStyles[rank] || podiumStyles[1];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: rank === 1 ? 0.2 : rank === 2 ? 0 : 0.4 }}
            className={`group relative p-8 rounded-3xl bg-[#121826] border border-gray-700/50 hover:border-gray-600 shadow-xl overflow-hidden ${style.height} flex flex-col`}
        >
            {/* Removed animated gradient background for corporate stability */}

            {/* Rank indicator at top */}
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg" style={{ backgroundColor: style.accentColor }}>
                #{rank}
            </div>

            {/* Card Content */}
            <div className="relative flex flex-col items-center text-center z-10 flex-1 justify-center">
                {/* Avatar with solid border */}
                <div className={`relative ${style.avatarSize} mb-6`}>
                    <div className="absolute inset-[-4px] rounded-full shadow-lg" style={{ backgroundColor: style.accentColor }}></div>
                    <div className="absolute inset-0 bg-[#0B0F1A] rounded-full z-0" />
                    <img
                        src={`https://github.com/${contributor}.png`}
                        alt={contributor}
                        className="w-full h-full rounded-full object-cover z-10 relative border-2 border-gray-700"
                    />
                    {/* Badge */}
                    <div className="absolute -bottom-2 -right-2 p-2 rounded-xl shadow-lg border border-gray-700 z-20" style={{ backgroundColor: style.accentColor }}>
                        <span className={style.badgeSize}>{badge.split(' ')[0]}</span>
                    </div>
                </div>

                {/* Roles & Info */}
                <div className="mb-4">
                    <span className="px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-3 block" style={{ backgroundColor: `${style.accentColor}20`, borderColor: `${style.accentColor}50`, color: style.accentColor }}>
                        {role}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {contributor}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>@{contributor}</p>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-[250px]" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {description}
                </p>

                {/* View Profile Button */}
                <motion.a
                    href={`https://github.com/${contributor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-bold shadow-lg transition-all duration-300"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    View Profile
                </motion.a>
            </div>

            {/* Removed decorative orbs for corporate stability */}
        </motion.div>
    );
};

export default FeaturedContributor;
