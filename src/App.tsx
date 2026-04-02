import React, { useState } from "react";
import {
  AppState,
  GenerationConfig,
  INITIAL_GENERATION_CONFIG,
} from "./types";
import { Layout } from "./components/Layout/Layout";
import { WelcomeScreen } from "./components/Screens/WelcomeScreen";
import { GeneratingScreen } from "./components/Screens/GeneratingScreen";
import { ErrorScreen } from "./components/Screens/ErrorScreen";
import ResultScreen from "./components/Screens/ResultScreen";
import PromptBuilderScreen from "./components/Screens/PromptBuilderScreen";
import ProviderConfigScreen from "./components/Screens/ProviderConfigScreen";
import Wizard from "./components/Wizard/Wizard";
import { useWizard } from "./hooks/useWizard";
import { generateSystemPersona } from "./services/geminiService";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [generatedPersona, setGeneratedPersona] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [generationConfig, setGenerationConfig] = useState<GenerationConfig>(
    INITIAL_GENERATION_CONFIG
  );

  const {
    answers,
    updateAnswer,
    handleNext,
    handleBack,
    resetWizard,
    currentQuestion,
    isFirst,
    isLast,
    stepIndex,
    totalSteps,
  } = useWizard();

  const handleStart = () => {
    setAppState(AppState.WIZARD);
  };

  const submitWizard = async () => {
    setAppState(AppState.GENERATING);
    try {
      const persona = await generateSystemPersona(answers, generationConfig);
      setGeneratedPersona(persona);
      setAppState(AppState.RESULT);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while connecting to the architect. Please try again."
      );
      setAppState(AppState.ERROR);
    }
  };

  const handleWizardComplete = () => {
    setAppState(AppState.PROVIDER);
  };

  const onNextStep = () => {
    handleNext(handleWizardComplete);
  };

  const onBackStep = () => {
    handleBack(() => setAppState(AppState.WELCOME));
  };

  const handleReset = () => {
    resetWizard();
    setGeneratedPersona("");
    setError(null);
    setGenerationConfig(INITIAL_GENERATION_CONFIG);
    setAppState(AppState.WELCOME);
  };

  const handleOpenPromptBuilder = () => {
    if (!generatedPersona) {
      return;
    }

    setAppState(AppState.PROMPT);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <WelcomeScreen onStart={handleStart} />;

      case AppState.WIZARD:
        return (
          <Wizard
            question={currentQuestion.question}
            description={currentQuestion.description}
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.key as keyof typeof answers]}
            onChange={updateAnswer}
            onNext={onNextStep}
            onBack={onBackStep}
            isFirst={isFirst}
            isLast={isLast}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
          />
        );

      case AppState.PROVIDER:
        return (
          <ProviderConfigScreen
            generationConfig={generationConfig}
            onGenerationConfigChange={setGenerationConfig}
            onGeneratePersona={submitWizard}
            onBackToWizard={() => setAppState(AppState.WIZARD)}
          />
        );

      case AppState.GENERATING:
        return <GeneratingScreen />;

      case AppState.RESULT:
        return (
          <ResultScreen
            persona={generatedPersona}
            onReset={handleReset}
            onBuildPrompt={handleOpenPromptBuilder}
          />
        );

      case AppState.PROMPT:
        return (
          <PromptBuilderScreen
            persona={generatedPersona}
            generationConfig={generationConfig}
            onBack={() => setAppState(AppState.RESULT)}
            onReset={handleReset}
          />
        );

      case AppState.ERROR:
        return (
          <ErrorScreen
            error={error}
            onRetry={() => setAppState(AppState.PROVIDER)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Layout
      onReset={handleReset}
      showReset={
        appState !== AppState.GENERATING && appState !== AppState.WELCOME
      }
      showNavLinks={appState === AppState.WELCOME}>
      {renderContent()}
    </Layout>
  );
};

export default App;
