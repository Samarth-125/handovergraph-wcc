'use client';
import Header from './Header';
import Hero from './Hero';
import RepoForm from './RepoForm';
import HowItWorks from './HowItWorks';

export default function Landing({ onDone }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl space-y-6 px-5 py-8">
        <Hero kicker="HANDOVER WORKSPACE" title="Pick up where your teammate left off." text="Turn scattered commits, pull requests and notes into a handover the next developer can check and trust." />
        <RepoForm onDone={onDone} />
        <HowItWorks />
      </main>
    </>
  );
}
