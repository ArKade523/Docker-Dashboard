import DockerContainerList from './DockerContainerList';
import PerformanceInfo from './PerformanceInfo';
import DockerForm from './DockerForm';

function App() {
  return (
    <>
      <PerformanceInfo />
      <DockerContainerList key={1} />
      <DockerForm />
    </>
  );
}

export default App;