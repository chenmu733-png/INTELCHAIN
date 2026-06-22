import {
  LayoutDashboard,
  Search,
  Wallet,
  Building2,
  Coins,
  LineChart,
  ArrowLeftRight,
  Waves,
  Share2,
  Image,
  Droplets,
  Bell,
  Star,
  GitCompare,
  Settings
} from 'lucide-react';

export const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/wallet', label: 'Wallet', icon: Wallet },
  { href: '/entity', label: 'Entity', icon: Building2 },
  { href: '/token', label: 'Token', icon: Coins },
  { href: '/markets', label: 'Markets', icon: LineChart },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { href: '/whale-tracker', label: 'Whale Tracker', icon: Waves },
  { href: '/network', label: 'Network Visualizer', icon: Share2 },
  { href: '/nft', label: 'NFT Analytics', icon: Image },
  { href: '/dex', label: 'DEX Analytics', icon: Droplets },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/watchlist', label: 'Watchlist', icon: Star },
  { href: '/compare', label: 'Compare', icon: GitCompare },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export const MOBILE_NAV = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/markets', label: 'Markets', icon: LineChart },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/settings', label: 'Profile', icon: Settings }
];
