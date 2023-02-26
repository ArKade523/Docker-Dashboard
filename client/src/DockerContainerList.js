import React from 'react';
import DockerContainer from './DockerContainer';

class DockerContainerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {containers: []};
    }

    componentDidMount() {
        // initial fetch that populates data before the first interval
        fetch('/containers')
        .then(response => response.json())
        .then(data => this.setState({ containers: data.containers }))
        .catch(error => console.error(error));

        // update the content automatically
        const intervalId = setInterval( async () => {
            const response = await fetch('/containers');
            const data = await response.json();
            this.setState({ containers: data.containers });
        }, 1000);

        return () => clearInterval(intervalId);
    }

    render() {
        return (
            <div class="block">
                <h1 class="container-header">Docker Containers</h1>
                {this.state.containers.map(container => 
                    <DockerContainer key={container.Id} container={container} />    
                )}
            </div>
        )
    }
}

export default DockerContainerList;