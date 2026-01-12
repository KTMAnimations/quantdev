export default function DisclaimerPage() {
  return (
    <div className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Disclaimer</h1>
        <div className="text-qp-text-secondary space-y-4 leading-relaxed">
          <p>
            OpenQuant is an open-source project intended for research and
            educational use. Nothing in this app is financial, investment, or
            trading advice.
          </p>
          <p>
            Past performance is not indicative of future results. Trading and
            investing involves risk, including the possible loss of principal.
          </p>
          <p>
            You are responsible for validating any strategy, signal, or output
            before using it in production.
          </p>
        </div>
      </div>
    </div>
  );
}

