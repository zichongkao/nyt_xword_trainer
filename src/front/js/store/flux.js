const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			round_score: 0, // correct answers in the current round.
			current_clue_index: 0, // integer between 0 and len(clue_list)-1 recording index of clue in play.
			current_clue_status: "unsubmitted", // one of {"unsubmitted", "correct", "wrong"}
			clue_list: [],
			is_loading: false,
			// Round Settings
			start_year: 2015,
			round_size: 30,
			top_x_answers: 200,
		},
		actions: {
			// Use getActions to call a function within a fuction
			loadClueList: () => {
				console.log('running loadClueList')
				setStore({is_loading: true})
				const store = getStore();
				const queryString = new URLSearchParams({
					round_size: store.round_size,
					start_year: store.start_year,
					top_x_answers: store.top_x_answers,
				})
				fetch("/api/clue?" + queryString)
					.then(resp => resp.json())
					.then(data => {setStore({ is_loading: false, clue_list: data.clue_list, round_score: 0, current_clue_index: 0, current_clue_status: "unsubmitted" })})
					.catch(error => console.log("Error loading message from backend", error));
				// For backend-less testing:
				/*
				setStore({
					clue_list: [
						{answer: 'Aron', clue: "Elvis' middle name?", explanation: "Elvis Presley's full name was Elvis Aron Presley.", total: '23', weekday: 'Mon', year: '2022'},
						{answer: 'TwoAron', clue: "Two Elvis' middle name?", explanation: "Two Elvis Presley's full name was Elvis Aron Presley.", total: '24', weekday: 'Tues', year: '2023'},
					],
					current_clue_index: 0,
					current_clue_status: "unsubmitted",
					round_score: 0
				});
				*/
			},
			incrementCurrentClueIndex: () => {
				console.log('running incrementCurrentClueIndex');
				const store = getStore();
				const potential_next = store.current_clue_index + 1;
				// Don't increment if we are at the end of the list.
				potential_next < store.clue_list.length && setStore({current_clue_index: potential_next});
			},
			setCurrentClueStatus: (new_status) => {
				console.log('running setCurrentClueStatus');
				// should assert to be one of {"unsubmitted", "correct", "wrong"}
				const store = getStore();
				setStore({current_clue_status: new_status})
			},
			incrementScore: () => {
				console.log('running incrementScore');
				const store = getStore();
				setStore({round_score: store.round_score +1})
			},
			setStartYear: (start_year) => {
				const store = getStore();
				setStore({ start_year })
			},
			setRoundSize: (round_size) => {
				const store = getStore();
				setStore({ round_size })
			},
			setTopXAnswers: (top_x_answers) => {
				const store = getStore();
				setStore({ top_x_answers })
			}
		}
	};
};

export default getState;
