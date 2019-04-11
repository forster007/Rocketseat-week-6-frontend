import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import { distanceInWords } from 'date-fns';
import { MdInsertDriveFile } from 'react-icons/md';

import pt from 'date-fns/locale/pt';
import api from '../../services/api';
import logo from '../../assets/logo.svg';
import './styles.css';

export default class Box extends Component {
	state = {
		box: {}
	}

	async componentDidMount() {
		this.subscribeToNewFiles();
		const box = this.props.match.params.id;
		const response = await api.get(`/boxes/${box}`);

		this.setState({
			box: response.data
		});
	}

	handleUpload = (files) => {
		files.forEach(file => {
			const data = new FormData();
			const box = this.props.match.params.id;

			data.append('file', file);

			api.post(`/boxes/${box}/files`, data);
		});
	}

	subscribeToNewFiles = () => {
		const box = this.props.match.params.id;
		const io = socket('https://omnistack-week-6-backend.herokuapp.com');

		io.emit('connectRoom', box);
		io.on('file', data => {
			this.setState({
				box: {
					...this.state.box,
					files: [
						data,
						...this.state.box.files
					]
				}
			});
		});
	}

	renderFiles = () => {
		const { files } = this.state.box;

		return files.map(file => (
			<li key={file._id}>
				<a className='fileInfo' href={file.url} target='_blank'>
					<MdInsertDriveFile color='#A5CFFF' size={24} />
					<strong>{file.title}</strong>
				</a>
				<span>Há {distanceInWords(file.createdAt, new Date(), { locale: pt })}</span>
			</li>
		));
	}

	render() {
		return (
			<div id='box-container'>
				<header>
					<img src={logo} alt='' />
					<h1>{this.state.box.title}</h1>
				</header>

				<Dropzone onDropAccepted={this.handleUpload}>
					{
						({ getRootProps, getInputProps }) => (
							<div className='upload' {...getRootProps()}>
								<input {...getInputProps()} />
								<p>Arraste arquivos ou clique aqui</p>
							</div>
						)
					}
				</Dropzone>

				<ul>
					{this.state.box.files && this.renderFiles()}
				</ul>
			</div>
		);
	}
}
