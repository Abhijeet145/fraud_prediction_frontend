import React, { useState } from 'react';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([
    'NameUpdated',
    'EmailInsertion',
    'GeolocationInsertion',
    'SelfiePictureReference',
    'MobilePhoneNumberInsertion',
    'HomeAddressInsertion',
    'TermsAcceptanceInsertion',
    'DocumentDataInsertion',
    'BirthDateInsertion',
    'ProfessionInsertion',
    'IncomeInsertion',
    'NewLeadCreated',
    'PoliticalExpositionInsertion',
    'USPersonInsertion',
    'AssetsInsertion',
    'PersonalInfoInsertion',
    'AddressMainChanged',
    'DataConfirmationUpdated',
    'CommercialAddressRemoved',
    'CommercialAddressInsertion',
    'ExternalImageSaving',
    'DocumentPictureReference',
    'DocumentOCR',
    'ExternalDocumentTypefication',
    'ExternalSelfiePictureQualityVerification',
    'ExternalDocumentExtraction',
    'DataValidation',
    'SelfieLiveness',
    'CommercialAddressVerified',
    'Vendor1Request',
    'FaceMatchRequest',
    'Vendor2Request',
    'DocumentValidation',
    'OnboardingTerminated',
    'HomeAddressVerified',
    'MobilePhoneNumberVerified',
    'EmailVerified',
    'ExternalSelfieLivenessSendImage',
    'ExternalFaceMatchSelfieDocument',
    'ExternalVendor1Request',
    'ExternalSelfieLivenessGetProcess',
    'ExternalVendor2Request',
    'ExternalDocumentNumberValidation',
    'LeadApproved',
    'OnboardingStateChanged',
    'DocumentFailure',
    'ExternalSelfieLivenessGetProcessDivergent',
    'SelfieLivenessFinishedNotification',
    'SelfieAndDocumentFailure',
    'LeadSelfieFailure',
    'ManualApproval',
    'InviteUpdated',
    'CheckExecutedEvent',
    'DocumentPictureRequestInsertion',
    'MemberGetMemberVerified'
  ]);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [riskScore, setRiskScore] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null); // To store response delay

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEventType) return;

    const newEvent = {
      eventType: selectedEventType,
      timestamp: new Date().toISOString(),
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    // Remove selected event from available list
    setAvailableEvents(availableEvents.filter(event => event !== selectedEventType));

    setSelectedEventType('');
    setLoading(true);
    setResponseTime(null); // Reset response time

    const prefix = updatedEvents.map(e => e.eventType);

    // Measure delay
    const startTime = performance.now();
    const { risk_score, recommendation } = await getRiskScoreFromBackend(prefix);
    const endTime = performance.now();
    const delay = (endTime - startTime).toFixed(2);

    setRiskScore(risk_score);
    setRecommendation(recommendation);
    setResponseTime(delay);
    setLoading(false);
  };

  const getRiskScoreFromBackend = async (prefix) => {
    const response = await fetch('https://fraud-prediction-backend.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix }),
    });
    const data = await response.json();
    return {
      risk_score: data.risk_score,
      recommendation: data.recommendation
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Digital Onboarding Fraud Detection</h1>
      </header>
      <main>
        <section>
          <h2>Enter Onboarding Events</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Event Type:
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                required
              >
                <option value="">Select an event</option>
                {availableEvents.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={loading || !selectedEventType}>
              {loading ? 'Processing...' : 'Add Event'}
            </button>
          </form>
        </section>

        <section>
          <h2>Current Event Sequence</h2>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                {event.eventType} - {new Date(event.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Fraud Risk Prediction</h2>
          {loading && <p>Calculating risk score...</p>}
          {riskScore !== null && !loading && (
            <div>
              <p><strong>Risk Score:</strong> {riskScore}%</p>
              <p><strong>Recommendation:</strong> {recommendation}</p>
              {responseTime !== null && (
                <p><strong>Response Time:</strong> {responseTime} ms</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
