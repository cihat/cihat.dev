'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Triangle, Database, AlertTriangle, CheckCircle, XCircle, Info, Sparkles, Code, Users, ShoppingCart, CreditCard, Globe, Server, Moon, Sun, Languages } from 'lucide-react';
import { themeEffect } from "@/lib/theme-effect";

type Theme = 'light' | 'dark';

const CAPTheoremAnalysis = () => {
  const [selectedCombination, setSelectedCombination] = useState('cp');
  const [theme, setTheme] = useState<Theme>('light');

  // Get current theme from system
  const getCurrentTheme = useCallback(() => {
    return themeEffect() as Theme;
  }, []);

  // Check for system preference and localStorage on mount
  useEffect(() => {
    setTheme(getCurrentTheme());
  }, [getCurrentTheme]);

  // Listen for theme changes from the system
  useEffect(() => {
    const onMediaChange = () => {
      setTheme(getCurrentTheme());
    };

    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    matchMedia.addEventListener("change", onMediaChange);
    
    return () => matchMedia.removeEventListener("change", onMediaChange);
  }, [getCurrentTheme]);

  // Listen for storage changes (when theme is changed from other components)
  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === "theme") {
        setTheme(getCurrentTheme());
      }
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [getCurrentTheme]);

  // Update theme when it changes from other components
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTheme = getCurrentTheme();
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [getCurrentTheme, theme]);

  const combinations = {
    'cp': {
      name: 'CP',
      fullName: 'Consistency + Partition Tolerance',
      description: 'Consistency and Partition Tolerance',
      sacrifice: 'Availability',
      color: 'from-blue-600 to-blue-700',
      borderColor: theme === 'dark' ? 'border-blue-800' : 'border-blue-200',
      bgColor: theme === 'dark' ? 'bg-blue-950/50' : 'bg-blue-50',
      textColor: theme === 'dark' ? 'text-blue-100' : 'text-blue-900',
      iconColor: 'text-blue-600',
      examples: [
        { name: 'MongoDB', icon: Database },
        { name: 'Redis', icon: Server },
        { name: 'HBase', icon: Database },
        { name: 'BigTable', icon: Database }
      ],
      useCase: 'Financial transactions, applications requiring critical data consistency',
      useCaseIcon: CreditCard,
      pros: [
        'Guaranteed data consistency',
        'ACID properties supported',
        'Reliable transactions',
        'Minimum data corruption risk'
      ],
      cons: [
        'System may stop during network partitions',
        'Low availability',
        'Potential performance issues',
        'Single point of failure risk'
      ]
    },
    'ap': {
      name: 'AP',
      fullName: 'Availability + Partition Tolerance',
      description: 'Availability and Partition Tolerance',
      sacrifice: 'Consistency',
      color: 'from-emerald-600 to-emerald-700',
      borderColor: theme === 'dark' ? 'border-emerald-800' : 'border-emerald-200',
      bgColor: theme === 'dark' ? 'bg-emerald-950/50' : 'bg-emerald-50',
      textColor: theme === 'dark' ? 'text-emerald-100' : 'text-emerald-900',
      iconColor: 'text-emerald-600',
      examples: [
        { name: 'Cassandra', icon: Database },
        { name: 'DynamoDB', icon: Server },
        { name: 'CouchDB', icon: Database },
        { name: 'Riak', icon: Server }
      ],
      useCase: 'Social media, e-commerce catalogs, content distribution systems',
      useCaseIcon: Users,
      pros: [
        'High availability (99.99%+)',
        'Continues working during network issues',
        'Horizontally scalable',
        'Fault tolerant architecture'
      ],
      cons: [
        'Eventual consistency model',
        'Data inconsistency risk',
        'Complex conflict resolution',
        'Read-after-write issues'
      ]
    },
    'ca': {
      name: 'CA',
      fullName: 'Consistency + Availability',
      description: 'Consistency and Availability',
      sacrifice: 'Partition Tolerance',
      color: 'from-violet-600 to-violet-700',
      borderColor: theme === 'dark' ? 'border-violet-800' : 'border-violet-200',
      bgColor: theme === 'dark' ? 'bg-violet-950/50' : 'bg-violet-50',
      textColor: theme === 'dark' ? 'text-violet-100' : 'text-violet-900',
      iconColor: 'text-violet-600',
      examples: [
        { name: 'PostgreSQL', icon: Database },
        { name: 'MySQL', icon: Database },
        { name: 'Oracle DB', icon: Server },
        { name: 'SQL Server', icon: Database }
      ],
      useCase: 'Traditional RDBMS, single-center systems',
      useCaseIcon: Code,
      pros: [
        'Strong ACID guarantees',
        'High availability',
        'Mature ecosystem',
        'SQL standard support'
      ],
      cons: [
        'Vulnerable to network partitions',
        'Single point of failure risk',
        'Limited horizontal scalability',
        'Geographic distribution difficulty'
      ]
    }
  };

  const properties = [
    {
      title: 'Consistency',
      description: 'All nodes see the same data at the same time. When data is updated, all read operations return the most recent data.',
      examples: 'ACID transactions, Strong consistency, Linearizability',
      color: 'from-rose-500 to-rose-600',
      bgColor: theme === 'dark' ? 'bg-rose-950/50' : 'bg-rose-50',
      borderColor: theme === 'dark' ? 'border-rose-800' : 'border-rose-200',
      textColor: theme === 'dark' ? 'text-rose-100' : 'text-rose-900',
      icon: CheckCircle
    },
    {
      title: 'Availability',
      description: 'The system remains operational and responds to requests. The system continues to function even when some nodes fail.',
      examples: '99.9% uptime, Fault tolerance, Graceful degradation',
      color: 'from-sky-500 to-sky-600',
      bgColor: theme === 'dark' ? 'bg-sky-950/50' : 'bg-sky-50',
      borderColor: theme === 'dark' ? 'border-sky-800' : 'border-sky-200',
      textColor: theme === 'dark' ? 'text-sky-100' : 'text-sky-900',
      icon: Globe
    },
    {
      title: 'Partition Tolerance',
      description: 'The system continues to operate during network partitions. Functionality is maintained even when communication between nodes is lost.',
      examples: 'Network splits, Data center outages, Distributed systems',
      color: 'from-teal-500 to-teal-600',
      bgColor: theme === 'dark' ? 'bg-teal-950/50' : 'bg-teal-50',
      borderColor: theme === 'dark' ? 'border-teal-800' : 'border-teal-200',
      textColor: theme === 'dark' ? 'text-teal-100' : 'text-teal-900',
      icon: Server
    }
  ];

  const CAPTriangle = () => (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 mx-auto mb-8 md:mb-12">
      <svg viewBox="0 0 320 280" className="w-full h-full drop-shadow-lg">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="activeGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="pulseGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Triangle background with gradient */}
        <polygon
          points="160,30 60,230 260,230"
          fill="url(#triangleGradient)"
          stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
          strokeWidth="2"
          opacity="0.1"
        />
        
        <defs>
          <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme === 'dark' ? '#1f2937' : '#f3f4f6'} stopOpacity="0.8"/>
            <stop offset="100%" stopColor={theme === 'dark' ? '#374151' : '#e5e7eb'} stopOpacity="0.2"/>
          </linearGradient>
        </defs>
        
        {/* Connection lines */}
        <line x1="160" y1="30" x2="60" y2="230" stroke={theme === 'dark' ? '#4b5563' : '#9ca3af'} strokeWidth="2" opacity="0.6"/>
        <line x1="160" y1="30" x2="260" y2="230" stroke={theme === 'dark' ? '#4b5563' : '#9ca3af'} strokeWidth="2" opacity="0.6"/>
        <line x1="60" y1="230" x2="260" y2="230" stroke={theme === 'dark' ? '#4b5563' : '#9ca3af'} strokeWidth="2" opacity="0.6"/>
        
        {/* Vertices - Active states based on selection */}
        <circle 
          cx="160" 
          cy="30" 
          r="45" 
          className={`${selectedCombination === 'cp' || selectedCombination === 'ca' ? 'fill-rose-300 stroke-rose-600' : 'fill-rose-100 stroke-rose-400'}`} 
          strokeWidth={selectedCombination === 'cp' || selectedCombination === 'ca' ? "6" : "3"} 
          filter={selectedCombination === 'cp' || selectedCombination === 'ca' ? "url(#activeGlow)" : "none"}
          style={{
            animation: selectedCombination === 'cp' || selectedCombination === 'ca' ? 'pulse 2s infinite' : 'none'
          }}
        />
        <circle 
          cx="60" 
          cy="230" 
          r="45" 
          className={`${selectedCombination === 'ap' || selectedCombination === 'ca' ? 'fill-sky-300 stroke-sky-600' : 'fill-sky-100 stroke-sky-400'}`} 
          strokeWidth={selectedCombination === 'ap' || selectedCombination === 'ca' ? "6" : "3"} 
          filter={selectedCombination === 'ap' || selectedCombination === 'ca' ? "url(#activeGlow)" : "none"}
          style={{
            animation: selectedCombination === 'ap' || selectedCombination === 'ca' ? 'pulse 2s infinite' : 'none'
          }}
        />
        <circle 
          cx="260" 
          cy="230" 
          r="45" 
          className={`${selectedCombination === 'cp' || selectedCombination === 'ap' ? 'fill-teal-300 stroke-teal-600' : 'fill-teal-100 stroke-teal-400'}`} 
          strokeWidth={selectedCombination === 'cp' || selectedCombination === 'ap' ? "6" : "3"} 
          filter={selectedCombination === 'cp' || selectedCombination === 'ap' ? "url(#activeGlow)" : "none"}
          style={{
            animation: selectedCombination === 'cp' || selectedCombination === 'ap' ? 'pulse 2s infinite' : 'none'
          }}
        />
        
        {/* Inner circles */}
        <circle cx="160" cy="30" r="35" className="fill-rose-50 stroke-rose-300" strokeWidth="2"/>
        <circle cx="60" cy="230" r="35" className="fill-sky-50 stroke-sky-300" strokeWidth="2"/>
        <circle cx="260" cy="230" r="35" className="fill-teal-50 stroke-teal-300" strokeWidth="2"/>
        
        {/* Active indicator rings for selected vertices */}
        {(selectedCombination === 'cp' || selectedCombination === 'ca') && (
          <circle 
            cx="160" 
            cy="30" 
            r="55" 
            fill="none" 
            stroke="#dc2626" 
            strokeWidth="3" 
            strokeDasharray="10,5"
            opacity="0.8"
            style={{ 
              animation: 'rotate 3s linear infinite',
              transformOrigin: '160px 30px'
            }}
          />
        )}
        {(selectedCombination === 'ap' || selectedCombination === 'ca') && (
          <circle 
            cx="60" 
            cy="230" 
            r="55" 
            fill="none" 
            stroke="#0284c7" 
            strokeWidth="3" 
            strokeDasharray="10,5"
            opacity="0.8"
            style={{ 
              animation: 'rotate 3s linear infinite',
              transformOrigin: '60px 230px'
            }}
          />
        )}
        {(selectedCombination === 'cp' || selectedCombination === 'ap') && (
          <circle 
            cx="260" 
            cy="230" 
            r="55" 
            fill="none" 
            stroke="#0d9488" 
            strokeWidth="3" 
            strokeDasharray="10,5"
            opacity="0.8"
            style={{ 
              animation: 'rotate 3s linear infinite',
              transformOrigin: '260px 230px'
            }}
          />
        )}
        
        {/* Labels with enhanced styling for active vertices */}
        <text 
          x="160" 
          y="25" 
          textAnchor="middle" 
          className={`text-sm sm:text-base font-bold ${
            selectedCombination === 'cp' || selectedCombination === 'ca' 
              ? 'fill-rose-800 font-extrabold' 
              : 'fill-rose-700'
          }`}
          style={{
            textShadow: selectedCombination === 'cp' || selectedCombination === 'ca' 
              ? '0 0 8px rgba(220, 38, 38, 0.5)' 
              : 'none'
          }}
        >
          Consistency
        </text>
        
        <text 
          x="60" 
          y="235" 
          textAnchor="middle" 
          className={`text-sm sm:text-base font-bold ${
            selectedCombination === 'ap' || selectedCombination === 'ca' 
              ? 'fill-sky-800 font-extrabold' 
              : 'fill-sky-700'
          }`}
          style={{
            textShadow: selectedCombination === 'ap' || selectedCombination === 'ca' 
              ? '0 0 8px rgba(2, 132, 199, 0.5)' 
              : 'none'
          }}
        >
          Availability
        </text>
        
        <text 
          x="260" 
          y="225" 
          textAnchor="middle" 
          className={`text-xs sm:text-sm font-bold ${
            selectedCombination === 'cp' || selectedCombination === 'ap' 
              ? 'fill-teal-800 font-extrabold' 
              : 'fill-teal-700'
          }`}
          style={{
            textShadow: selectedCombination === 'cp' || selectedCombination === 'ap' 
              ? '0 0 8px rgba(13, 148, 136, 0.5)' 
              : 'none'
          }}
        >
          Partition
        </text>
        <text 
          x="260" 
          y="240" 
          textAnchor="middle" 
          className={`text-xs sm:text-sm font-bold ${
            selectedCombination === 'cp' || selectedCombination === 'ap' 
              ? 'fill-teal-800 font-extrabold' 
              : 'fill-teal-700'
          }`}
          style={{
            textShadow: selectedCombination === 'cp' || selectedCombination === 'ap' 
              ? '0 0 8px rgba(13, 148, 136, 0.5)' 
              : 'none'
          }}
        >
          Tolerance
        </text>
      </svg>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4`}>
            CAP Theorem
          </h1>
          <p className={`text-lg sm:text-xl mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            In distributed systems, you can only guarantee two properties at the same time
          </p>
          
          {/* Alert Box */}
          <div className={`bg-gradient-to-r ${
            theme === 'dark' 
              ? 'from-amber-900/50 to-orange-900/50 border-amber-700' 
              : 'from-amber-50 to-orange-50 border-amber-200'
          } border rounded-2xl p-4 sm:p-6 mx-auto max-w-4xl shadow-sm`}>
            <div className="flex items-start">
              <div className={`p-2 rounded-lg mr-3 sm:mr-4 ${
                theme === 'dark' ? 'bg-amber-800' : 'bg-amber-100'
              }`}>
                <AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                }`} />
              </div>
              <div className="text-left">
                <h3 className={`font-bold mb-2 text-sm sm:text-base ${
                  theme === 'dark' ? 'text-amber-200' : 'text-amber-800'
                }`}>
                  CAP Theorem
                </h3>
                <p className={`leading-relaxed text-sm sm:text-base ${
                  theme === 'dark' ? 'text-amber-300' : 'text-amber-700'
                }`}>
                  A distributed system cannot guarantee all three of the following properties simultaneously: 
                  <strong> Consistency</strong>, <strong>Availability</strong> and <strong>Partition Tolerance</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CAP Triangle */}
        <CAPTriangle />

        {/* Combination Selector */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6 mb-8 md:mb-12">
          {Object.entries(combinations).map(([key, combo]) => (
            <button
              key={key}
              onClick={() => setSelectedCombination(key)}
              className={`group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedCombination === key
                  ? `bg-gradient-to-r ${combo.color} text-white shadow-xl shadow-blue-200/50`
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 shadow-md border border-gray-600'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{combo.name}</span>
              </div>
              <div className="text-xs sm:text-sm font-normal mt-1 opacity-90">
                {combo.fullName}
              </div>
              {selectedCombination === key && (
                <div className="absolute inset-0 rounded-2xl bg-white/20 animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Selected Combination Details */}
        <div className={`${combinations[selectedCombination].bgColor} ${combinations[selectedCombination].borderColor} border-2 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 md:mb-12 transition-all duration-500`}>
          <div className="flex items-center mb-4 md:mb-6">
            <div className={`bg-gradient-to-r ${combinations[selectedCombination].color} text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold text-base sm:text-lg flex items-center shadow-lg`}>
              <Database className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              {combinations[selectedCombination].fullName}
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <div className="flex items-center mb-3 md:mb-4">
                  <Info className={`w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${combinations[selectedCombination].iconColor}`} />
                  <h3 className={`text-lg sm:text-xl font-bold ${combinations[selectedCombination].textColor}`}>
                    Description
                  </h3>
                </div>
                <p className={`${combinations[selectedCombination].textColor} leading-relaxed text-base sm:text-lg`}>
                  {combinations[selectedCombination].description}
                </p>
              </div>
              
              <div className={`border-2 rounded-xl p-3 sm:p-4 ${
                theme === 'dark' 
                  ? 'bg-red-950/50 border-red-800' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center mb-2">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                  <span className={`font-bold text-sm sm:text-base ${
                    theme === 'dark' ? 'text-red-300' : 'text-red-800'
                  }`}>
                    Sacrifice
                  </span>
                </div>
                <p className={`font-medium text-sm sm:text-base ${
                  theme === 'dark' ? 'text-red-400' : 'text-red-700'
                }`}>
                  {combinations[selectedCombination].sacrifice}
                </p>
              </div>

              {/* Use Case */}
              <div className={`rounded-xl p-4 sm:p-6 border shadow-sm ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center mb-3">
                  {React.createElement(combinations[selectedCombination].useCaseIcon, {
                    className: `w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 ${combinations[selectedCombination].iconColor}`
                  })}
                  <h4 className={`font-bold text-base sm:text-lg ${combinations[selectedCombination].textColor}`}>
                    Use Cases
                  </h4>
                </div>
                <p className={`leading-relaxed text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {combinations[selectedCombination].useCase}
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4 md:space-y-6">
              {/* Examples */}
              <div>
                <h3 className={`text-lg sm:text-xl font-bold mb-3 md:mb-4 ${combinations[selectedCombination].textColor}`}>
                  Example Systems
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {combinations[selectedCombination].examples.map((example, index) => (
                    <div key={index} className={`rounded-xl px-3 sm:px-4 py-2 sm:py-3 font-semibold text-center border shadow-sm hover:shadow-md transition-shadow flex items-center justify-center space-x-2 text-sm sm:text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-600 text-gray-200' 
                        : 'bg-white border-gray-200'
                    }`}>
                      {React.createElement(example.icon, {
                        className: theme === 'dark' ? "w-3 h-3 sm:w-4 sm:h-4 text-gray-400" : "w-3 h-3 sm:w-4 sm:h-4 text-gray-600"
                      })}
                      <span>{example.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid gap-4 md:gap-6">
                <div>
                  <h4 className="font-bold text-emerald-700 mb-3 flex items-center text-base sm:text-lg">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Advantages
                  </h4>
                  <div className="space-y-2">
                    {combinations[selectedCombination].pros.map((pro, index) => (
                      <div key={index} className={`flex items-start rounded-lg p-2 sm:p-3 border text-sm sm:text-base ${
                        theme === 'dark' 
                          ? 'bg-emerald-950/50 border-emerald-800' 
                          : 'bg-emerald-50 border-emerald-200'
                      }`}>
                        <span className="text-emerald-500 mr-2 sm:mr-3 mt-0.5">•</span>
                        <span className={theme === 'dark' ? 'text-emerald-300' : 'text-emerald-800'}>
                          {pro}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-red-700 mb-3 flex items-center text-base sm:text-lg">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Disadvantages
                  </h4>
                  <div className="space-y-2">
                    {combinations[selectedCombination].cons.map((con, index) => (
                      <div key={index} className={`flex items-start rounded-lg p-2 sm:p-3 border text-sm sm:text-base ${
                        theme === 'dark' 
                          ? 'bg-red-950/50 border-red-800' 
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <span className="text-red-500 mr-2 sm:mr-3 mt-0.5">•</span>
                        <span className={theme === 'dark' ? 'text-red-300' : 'text-red-800'}>
                          {con}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CAP Properties Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {properties.map((property, index) => (
            <div key={index} className={`${property.bgColor} ${property.borderColor} border-2 rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className={`p-2 sm:p-3 bg-gradient-to-r ${property.color} rounded-xl shadow-lg`}>
                  {React.createElement(property.icon, {
                    className: "w-5 h-5 sm:w-6 sm:h-6 text-white"
                  })}
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className={`text-lg sm:text-xl font-bold ${property.textColor}`}>
                    {property.title}
                  </h3>
                </div>
              </div>
              
              <p className={`${property.textColor} leading-relaxed mb-3 md:mb-4 text-sm sm:text-base`}>
                {property.description}
              </p>
              
              <div className={`rounded-xl p-3 sm:p-4 border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className={`text-sm font-semibold ${property.textColor} mb-2`}>
                  Examples:
                </div>
                <div className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {property.examples}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Decision Guide */}
        <div className={`bg-gradient-to-r border-2 rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl ${
          theme === 'dark' 
            ? 'from-slate-800 to-slate-900 border-slate-700' 
            : 'from-slate-50 to-slate-100 border-slate-200'
        }`}>
          <div className="flex items-center mb-4 md:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold ml-3 sm:ml-4 ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Which Combination Should I Choose?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className={`rounded-2xl p-4 sm:p-6 shadow-md border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-blue-700' 
                : 'bg-white border-blue-200'
            }`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-bold">
                  CP
                </div>
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 text-blue-600" />
              </div>
              <h4 className={`font-bold mb-2 text-sm sm:text-base ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              }`}>
                When Consistency is Critical
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Banking, financial transactions, inventory management, systems requiring critical data integrity
              </p>
            </div>

            <div className={`rounded-2xl p-4 sm:p-6 shadow-md border ${
              theme === 'dark' 
                ? 'bg-gray-800 border-emerald-700' 
                : 'bg-white border-emerald-200'
            }`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-bold">
                  AP
                </div>
                <Users className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 text-emerald-600" />
              </div>
              <h4 className={`font-bold mb-2 text-sm sm:text-base ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              }`}>
                When Availability is Critical
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Social media, websites, e-commerce catalogs, content delivery networks, IoT systems
              </p>
            </div>

            <div className={`rounded-2xl p-4 sm:p-6 shadow-md border md:col-span-2 lg:col-span-1 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-violet-700' 
                : 'bg-white border-violet-200'
            }`}>
              <div className="flex items-center mb-3 md:mb-4">
                <div className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-xl text-xs sm:text-sm font-bold">
                  CA
                </div>
                <Code className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 text-violet-600" />
              </div>
              <h4 className={`font-bold mb-2 text-sm sm:text-base ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              }`}>
                When Network Partitions are Rare
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Single data center, traditional RDBMS, small-scale applications, LAN environments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAPTheoremAnalysis;
