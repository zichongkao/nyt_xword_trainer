const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			round_score: 0, // correct answers in the current round.
			current_clue_index: 0, // integer between 0 and len(clue_list)-1 recording index of clue in play.
			current_clue_status: "unsubmitted", // one of {"unsubmitted", "correct", "wrong"}
			clue_list: [],
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			loadClueList: () => {
				console.log('running loadClueList')
				/*
				fetch("/api/clue")
					.then(resp => resp.json())
					.then(data => {setStore({ clue_list: data.clue_list, round_score: 0, current_clue_index: 0, current_clue_status: "unsubmitted" })})
					.catch(error => console.log("Error loading message from backend", error));
					*/
				// For backend-less testing:
				setStore({
					clue_list: [
						{answer: 'Aron', clue: "Elvis' middle name?", explanation: "Elvis Presley's full name was Elvis Aron Presley.", total: '23', weekday: 'Mon', year: '2022'},
						{answer: 'TwoAron', clue: "Two Elvis' middle name?", explanation: "Two Elvis Presley's full name was Elvis Aron Presley.", total: '24', weekday: 'Tues', year: '2023'},
					],
					current_clue_index: 0,
					current_clue_status: "unsubmitted",
					round_score: 0
				});
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

			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
