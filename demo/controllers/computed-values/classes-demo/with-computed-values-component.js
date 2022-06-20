import { css, html, LitElement } from 'lit';
import ClassesApi from './classes-api.js';
import ComputedValues from '../../../../src/controllers/computed-values/computed-values.js';
import ListPaginationController from './list-pagination-controller.js';

function calcMaxPages(rows, rowsPerPage) {
	return Math.max(1, Math.ceil(rows / rowsPerPage));
}

class WithComputedValuesComponent extends LitElement {
	static properties = {
		selectedClassId: { type: Number },
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

		this.selectedClassId = '';
		this.page = 1;
		this.pageSize = 20;
		this.highlightedStudents = {};

		this._computed = new ComputedValues(this, [{
			name: 'classes',
			isAsync: true,
			getDependencies: () => [],
			compute: () => ClassesApi.getClasses()
		}, {
			name: 'students',
			isAsync: true,
			getDependencies: () => [this.selectedClassId],
			compute: (selectedClassId) => {
				if (typeof selectedClassId !== 'number') { return null; }

				return ClassesApi.getStudents(selectedClassId);
			}
		}, {
			name: 'gradeAverages',
			getDependencies: () => [this._computed.students.value],
			compute: (students) => {
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
		}, {
			name: 'paginatedStudents',
			Controller: ListPaginationController,
			getDependencies: () => [this._computed.gradeAverages.value?.studentsWithAverageGrades, this.page, this.pageSize]
		}]);
	}

	render() {
		if (this._computed.classes.pending) { return 'Loading...'; }

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
					${this._computed.classes.value.map((c) => html`
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
				Class Average: ${this._computed.gradeAverages.value?.classAverage}
			</div>
			${this.renderTable(this._computed.paginatedStudents.value)}
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
					?disabled=${this.page >= calcMaxPages(this._computed.students.value.length, this.pageSize)}
					@click=${this._genHandlePageChange(this.page + 1)}
				>&rarr;</button>
			</div>
		`;
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
customElements.define('with-computed-values-component', WithComputedValuesComponent);
