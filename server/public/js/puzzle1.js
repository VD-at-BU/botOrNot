// server/public/js/puzzle1.js
// Visual Sort puzzle logic for BotOrNot

const puzzleDataUrl = "../models/puzzle_items.json";

// how long before attempts reset (seconds)
// example: 60 = 1 minute, 120 = 2 minutes, raise when deploying
const resetClock = 30;

// DOM references
const availableItemsContainer = document.getElementById("available-items");
const ariaStatusRegion = document.getElementById("aria-status");
const instructionElement = document.getElementById("puzzle-instruction");

const dropzoneA = document.getElementById("dropzone-a");
const dropzoneB = document.getElementById("dropzone-b");
const allDropzones = [dropzoneA, dropzoneB];

// Internal state
let mistakes = 0;

// Random integer [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Shallow shuffle
function shuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Screen-reader announcement (no visible hint)
function announceStatus(messageText) {
  if (ariaStatusRegion) {
    ariaStatusRegion.textContent = messageText;
  }
}

// Build one draggable card from an asset
function createDraggableItemCard(item) {
  const card = document.createElement("div");
  card.className = "item-card";
  card.draggable = true;

  const id = `${item.category}:${item.fileName}`;
  card.dataset.itemId = id;
  card.dataset.category = item.category;

  // Accessibility: describe category but don't show it visually
  card.setAttribute("role", "listitem");
  card.setAttribute("aria-label", `Icon from category ${item.category}`);

  const icon = document.createElement("img");
  icon.className = "item-icon";
  icon.alt = "";
  icon.src = `../images/${item.category}/${item.fileName}`;
  icon.onerror = () => {
    icon.src = "../images/favicon.ico";
  };

  card.appendChild(icon);

  // No visible text

  card.addEventListener("dragstart", (ev) => {
    ev.dataTransfer.setData("text/plain", id);
  });

  return card;
}

// Shuffle remaining unsorted cards after each drop
function shuffleRemainingAvailableCards() {
  const remaining = Array.from(availableItemsContainer.children);
  const shuffled = shuffleArray(remaining);
  shuffled.forEach((node) => availableItemsContainer.appendChild(node));
}

// Attach drop behavior to a dropzone
function enableDropzoneBehavior(dropzoneElement) {
  dropzoneElement.addEventListener("dragover", (ev) => {
    ev.preventDefault();
    dropzoneElement.classList.add("dropzone--over");
  });

  dropzoneElement.addEventListener("dragleave", () => {
    dropzoneElement.classList.remove("dropzone--over");
  });

  dropzoneElement.addEventListener("drop", (ev) => {
    ev.preventDefault();
    dropzoneElement.classList.remove("dropzone--over");

    const draggedId = ev.dataTransfer.getData("text/plain");
    const draggedCard = availableItemsContainer.querySelector(
      `.item-card[data-item-id="${draggedId}"]`
    );

    if (!draggedCard) return;

    // Always allow the drop: no visible “wrong/blocked” feedback.
    dropzoneElement.appendChild(draggedCard);

    const draggedCategory = draggedCard.dataset.category;
    const acceptedCategory = dropzoneElement.dataset.acceptCategory;
    const correct = draggedCategory === acceptedCategory;

    if (!correct) {
      mistakes += 1;
      // Only a hint, no visible errors
      announceStatus("One or more items may have been placed incorrectly");
    }

    // Shuffle remaining cards in the source line
    shuffleRemainingAvailableCards();

    // If there are no more cards in the source line, end the puzzle
    if (availableItemsContainer.children.length === 0) {
      const header = document.getElementById("available-items-title");
      if (header) {
        header.textContent = "All items have been sorted";
        header.classList.add("success-banner");
      }

      const dropzonesHeader = document.getElementById("dropzones-title");
      if (dropzonesHeader) {
        dropzonesHeader.classList.add("is-hidden");
      }

      availableItemsContainer.classList.add("is-hidden");

      // Decide success/failure silently
      const succeeded = mistakes === 0;

      // Track attempt count with a timed reset
      let attempts = 0;
      const now = Date.now();
      const timeoutMs = resetClock * 1000;

      try {
        const raw = window.sessionStorage.getItem("botornot-p1-info");
        if (raw) {
          const info = JSON.parse(raw);
          const lastTime = Number(info.timestamp || 0);

          // If within timeout, reuse existing attempts, otherwise, go ahead and reset
          if (now - lastTime < timeoutMs) {
            attempts = Number(info.attempts || 0);
          } else {
            attempts = 0;
          }
        }

        attempts += 1;

        const infoToStore = {
          attempts,
          timestamp: now,
          lastResult: succeeded ? "success" : "fail"
        };

        window.sessionStorage.setItem(
          "botornot-p1-info",
          JSON.stringify(infoToStore)
        );
      } catch (e) {
        // If sessionStorage fails, treat as first attempt every time
        attempts = 1;
      }

      // Decide where to go next 
      if (succeeded) {
        window.location.href = "../results/human-final.html";
      } else {
		if (attempts === 1) {
		  window.location.href = "../results/suspected-bot-1.html?p=1";
		} else if (attempts === 2) {
		  window.location.href = "../results/suspected-bot-2.html?p=1";
		} else {
		  window.location.href = "../results/bot-final.html";
		}			
      }
    }
  });
}

// Initialize the puzzle from JSON
async function initializeVisualSort() {
  try {
    const response = await fetch(puzzleDataUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    const categories = Object.keys(data.categories || {});
    if (categories.length < 2) {
      if (instructionElement) {
        instructionElement.textContent =
          "Configuration Error: Not enough categories to build this puzzle";
      }
      return;
    }

    // Choose two distinct categories
    const shuffledCats = shuffleArray(categories);
    const categoryA = shuffledCats[0];
    const categoryB = shuffledCats[1];

    const itemsPerPuzzle = data.itemsPerPuzzle || 8;
    const minPerCategory = 2; // pick at least 2 per category
    const maxForA = itemsPerPuzzle - minPerCategory;

    const countA = randInt(minPerCategory, maxForA);
    const countB = itemsPerPuzzle - countA;

    const poolA = shuffleArray(data.categories[categoryA]);
    const poolB = shuffleArray(data.categories[categoryB]);

    const sampleA = poolA.slice(0, countA);
    const sampleB = poolB.slice(0, countB);

    const mixedItems = shuffleArray([...sampleA, ...sampleB]);

    const aLabel = categoryA.toUpperCase();
    const bLabel = categoryB.toUpperCase();

    // Update headings and instruction
    const titleEl = document.getElementById("page-title");
    const availableTitleEl = document.getElementById("available-items-title");
    const dropzonesTitleEl = document.getElementById("dropzones-title");

    if (titleEl) {
      titleEl.textContent = `VISUAL SORT: ${aLabel} VS ${bLabel}`;
    }
    if (availableTitleEl) {
      availableTitleEl.textContent = `Icons from ${aLabel} and ${bLabel}`;
    }
    if (dropzonesTitleEl) {
      dropzonesTitleEl.textContent = `${aLabel} and ${bLabel} drop zones`;
    }
    if (instructionElement) {
      instructionElement.textContent =
        `Sort all ${aLabel} icons into the ${aLabel} drop zone ` +
        `and all ${bLabel} icons into the ${bLabel} drop zone`;
    }

    // Configure dropzones
    dropzoneA.dataset.acceptCategory = categoryA;
    dropzoneB.dataset.acceptCategory = categoryB;

    const labelA = document.getElementById("dropzone-a-label");
    const labelB = document.getElementById("dropzone-b-label");
    if (labelA) labelA.textContent = aLabel;
    if (labelB) labelB.textContent = bLabel;

    // Render items
    mixedItems.forEach((item) => {
      const card = createDraggableItemCard(item);
      availableItemsContainer.appendChild(card);
    });

    // Enable drag & drop
    allDropzones.forEach(enableDropzoneBehavior);

    announceStatus("Drag each icon into the matching category drop zone");
  } catch (err) {
    console.error("Failed to load puzzle items:", err);
    if (instructionElement) {
      instructionElement.textContent =
        "Unable to load puzzle items. Please reload the page or try again";
    }
    announceStatus("Puzzle data could not be loaded");
  }
}

// Kick off setup
initializeVisualSort();
