import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],  
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
        '2xl': '3rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-el-messiri)', 'El Messiri', 'serif', 'ui-sans-serif', 'system-ui'],
  			'el-messiri': ['var(--font-el-messiri)', 'El Messiri', 'serif'],
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			'royal-primary': '#C7203E',
  			'cream-light': '#FCF9F2',
  			'cream-dark': '#F2E4C1',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: '#C7203E',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},  		backgroundImage: {
  			'royal-gradient': 'linear-gradient(135deg, #FCF9F2 0%, #F2E4C1 100%)',
  			'royal-gradient-vertical': 'linear-gradient(to bottom, #FCF9F2 0%, #F2E4C1 100%)',
  			'royal-primary-shiny': 'linear-gradient(135deg, #C7203E 0%, #E63946 25%, #C7203E 50%, #A11B35 75%, #C7203E 100%)',
  			'royal-primary-glossy': 'linear-gradient(45deg, #A11B35 0%, #C7203E 25%, #E63946 50%, #C7203E 75%, #A11B35 100%)',
  			'royal-primary-metallic': 'linear-gradient(135deg, #8B1538 0%, #A11B35 20%, #C7203E 40%, #E63946 60%, #C7203E 80%, #A11B35 100%)',
  			'royal-shine-animation': 'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.3) 50%, transparent 75%)',
  			'sufiyana-pattern': 'url("/sufiyana-background-01.svg")',
  			'pattern-icon': 'url("/pattern-icon-01.svg")',
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'shine': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' }
        },
        'royal-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(199, 32, 62, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(199, 32, 62, 0.6), 0 0 60px rgba(199, 32, 62, 0.4)' }
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
  		},  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 30s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.6s ease-out',
        'shine': 'shine 2s ease-in-out infinite',
        'royal-glow': 'royal-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 4s ease infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
