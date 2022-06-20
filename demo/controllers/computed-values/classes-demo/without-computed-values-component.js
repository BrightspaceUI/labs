import { css, html, LitElement } from 'lit';
import ClassesApi from './classes-api.js';

function calcMaxPages(rows, rowsPerPage) {
	return Math.max(1, Math.ceil(rows / rowsPerPage));
}

function paginateList(list, page, pageSize) {
	if (!list) { return null; }

	if (!Number.isInteger(page) || page < 1) {
		throw new TypeError('Invalid page dependency: page must be an integer greater than 0.');
	}
	if (!Number.isInteger(pageSize) || pageSize < 1) {
		throw new TypeError('Invalid pageSize dependency: pageSize must be an integer greater than 0.');
	}

	const start = (page - 1) * pageSize;
	const end = start + pageSize;

	return list.slice(start, end);
}

class WithoutComputedValuesComponent extends LitElement {
	static properties = {
		classes: { type: Array },
		selectedClassId: { type: Number },
		students: { type: Array },
		page: { type: Number },
		pageSize: { type: Number },
		highlightedStudents: { type: Object }
	};

	static styles = css`
		.table-wrapper {
			max-height: 500px;
			overflow: auto;
		}
		.highlighted {
			font-weight: bold;
			color: blue;
		}
	`;

	constructor() {
		super();

		this.classes = null;
		this.selectedClassId = '';
		this.students = null;
		this.page = 1;
		this.pageSize = 20;
		this.highlightedStudents = {};

		ClassesApi.getClasses().then((classes) => {
			this.classes = classes;
		});
	}

	render() {
		if (!this.classes) { return 'Loading...'; }

		const gradeAverages = this.students ? this._calcGradeAverages(this.students) : null;
		const paginatedStudents = paginateList(gradeAverages?.studentsWithAverageGrades, this.page, this.pageSize);

		return html`
			<div>
				Class:
				<select @change=${this._handleSelectClass}>
					<option
						value=""
						disabled
						?selected=${this.selectedClassId === ''}
					>
						-- Select a Class --
					</option>
					${this.classes.map((c) => html`
						<option
							value=${c.id}
							?selected=${this.selectedClassId === c.id}
						>
							${c.name}
						</option>
					`)}
				</select>
			</div>
			<div>
				Class Average: ${gradeAverages?.classAverage}
			</div>
			${this.renderTable(paginatedStudents)}
		`;
	}

	renderTable(students) {
		if (!this.selectedClassId) { return ''; }
		if (!Array.isArray(students)) { return 'Loading...'; }

		return html`
			<div class="table-wrapper">
				<table>
					<tr>
						<th>
							First Name
						</th>
						<th>
							Last Name
						</th>
						<th>
							Email
						</th>
						<th>
							Average Grade
						</th>
						<th></th>
					</tr>
					${students.map((student) => html`
						<tr class="${this.highlightedStudents[student.id] ? 'highlighted' : ''}">
							<td>
								${student.firstName}
							</td>
							<td>
								${student.lastName}
							</td>
							<td>
								${student.email}
							</td>
							<td>
								${student.averageGrade}
							</td>
							<td>
								<button @click=${this._genHandleHighlight(student.id)}>
									${student.highlighted ? 'Un-Highlight' : 'Highlight'}
								</button>
							</td>
						</tr>
					`)}
				</table>
			</div>
			<div>
				<button
					?disabled=${this.page <= 1}
					@click=${this._genHandlePageChange(this.page - 1)}
				>&larr;</button>
				${this.page}
				<button
					?disabled=${this.page >= calcMaxPages(this.students.length, this.pageSize)}
					@click=${this._genHandlePageChange(this.page + 1)}
				>&rarr;</button>
			</div>
		`;
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('selectedClassId')) {
			if (typeof this.selectedClassId !== 'number') {
				this.students = null;
			} else {
				ClassesApi.getStudents(this.selectedClassId).then((students) => {
					this.students = students;
				});
			}
		}
	}

	_calcGradeAverages(students) {
		if (!students) return null;

		let studentAveragesSum = 0;
		const studentsWithAverageGrades = students.map((student) => {
			const averageGrade = student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length;

			studentAveragesSum += averageGrade;

			return {
				...student,
				averageGrade: student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length
			};
		});

		return {
			studentsWithAverageGrades,
			classAverage: studentAveragesSum / students.length
		};
	}

	_genHandleHighlight(studentId) {
		return () => {
			this.highlightedStudents[studentId] = !this.highlightedStudents[studentId];
			this.requestUpdate();
		};
	}

	_genHandlePageChange(newPage) {
		return () => {
			this.page = newPage;
		};
	}

	_handleSelectClass(event) {
		this.selectedClassId = Number(event.target.value);
	}
}
customElements.define('without-computed-values-component', WithoutComputedValuesComponent);
