import { GitHubIcon, LinkedInIcon } from '../components/icons';
import { FiMail, FiTwitter, FiInstagram } from 'react-icons/fi';

type LinkItem = { name: string; desc: string; href: string; Icon: React.ElementType };

export const PROFESSIONAL: LinkItem[] = [
  { name: 'Email',    desc: 'rushillshah2000@gmail.com', href: 'mailto:rushillshah2000@gmail.com', Icon: FiMail },
  { name: 'GitHub',   desc: '@rushillshah',               href: 'https://github.com/rushillshah',   Icon: GitHubIcon },
  { name: 'LinkedIn', desc: 'Find me!',               href: 'https://www.linkedin.com/in/rushill-shah-1889a3145/', Icon: LinkedInIcon },
];

export const SOCIAL: LinkItem[] = [
  { name: 'Twitter',   desc: '@rushillshah',  href: 'https://twitter.com/rushillshah',   Icon: FiTwitter },
  { name: 'Instagram', desc: '@rushillshah',  href: 'https://instagram.com/rushillshah', Icon: FiInstagram },
];