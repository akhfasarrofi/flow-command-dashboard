import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Home' }];

export default function HomePage() {
  return <div>Welcome to Remix!</div>;
}
