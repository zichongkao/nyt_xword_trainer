const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			correct: 0, // correct answers in the current round.
			wrong: 0, // wrong answers in the current round.
			current_clue_index: 0, // integer between 0 and len(clue_list)-1 recording index of clue in play.
			current_clue_status: "unsubmitted", // one of {"unsubmitted", "correct", "wrong"}
			clue_list: [],
			is_loading: false,
			// Round Settings
			round_size: 10, // tracked here, but can't be changed anywhere.
			min_answer_rank: 1,
			max_answer_rank: 10,
		},
		actions: {
			// Use getActions to call a function within a fuction
			loadClueList: () => {
				setStore({is_loading: true})
				const store = getStore();
				const queryString = new URLSearchParams({
					round_size: 10,
					min_answer_rank: store.min_answer_rank,
					max_answer_rank: store.max_answer_rank,
				})
				fetch("/api/clue?" + queryString)
					.then(resp => resp.json())
					.then(data => {setStore({ is_loading: false, clue_list: data.clue_list, correct: 0, wrong: 0, current_clue_index: 0, current_clue_status: "unsubmitted" })})
					.catch(error => console.log("Error loading message from backend", error));
				/*	
				// For backend-less testing:
				setStore({
					clue_list: [
						{answer: 'Aron', clue: "Elvis' middle name?", answer_count: '20', answer_rank: '2',
						 index: '1-ACROSS', weekday: 'Mon', year: '2022', month: '1', day:'2'},
						{answer: 'TwoAron', clue: "Two Elvis' middle name?", answer_count: '24', answer_rank: '1',
						 index: '2-DOWN', weekday: 'Tues', year: '2023', month: '1', day:'2'},
					],
					current_clue_index: 0,
					current_clue_status: "unsubmitted",
					correct: 0,
					wrong: 0
				});
				*/
			},
			incrementCurrentClueIndex: () => {
				const store = getStore();
				const potential_next = store.current_clue_index + 1;
				// Don't increment if we are at the end of the list.
				potential_next < store.clue_list.length && setStore({current_clue_index: potential_next});
			},
			setCurrentClueStatus: (new_status) => {
				// should assert to be one of {"unsubmitted", "correct", "wrong"}
				const store = getStore();
				setStore({current_clue_status: new_status})
			},
			incrementCorrect: () => {
				const store = getStore();
				setStore({correct: store.correct +1})
			},
			incrementWrong: () => {
				const store = getStore();
				setStore({wrong: store.wrong +1})
			},
			setMinAnswerRank: (min_answer_rank) => {
				const store = getStore();
				setStore({ min_answer_rank })
			},
			setMaxAnswerRank: (max_answer_rank) => {
				const store = getStore();
				setStore({ max_answer_rank })
			}
		}
	};
};

export default getState;
