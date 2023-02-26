import React from 'react';

function DockerContainer(props) {
    return (
        <div class="container">
            <h2 class="container-name">{props.container.Names[0]}</h2>
            <p class="container-info">Image: {props.container.Image}</p>
            <p class="container-info">State: {props.container.State}</p>
            <p class="container-info">Status: {props.container.Status}</p>
        </div>
    );
}

export default DockerContainer;