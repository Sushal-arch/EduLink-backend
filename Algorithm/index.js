function finalData(data, priorityList) {
  const final = data.map((item) => {
    const match = priorityList.find(
      (priorityItem) => priorityItem.title === item.questionSubject
    );

    if (match) {
      return { ...item, priority: match.priority };
    } else {
      return { ...item, priority: 1.5 };
    }
  });

  return final;
}

function findPrioritySubject(subjects) {
  const subjectCounts = subjects.reduce((acc, item) => {
    const subject = item.questionSubject;
    const existing = acc.find((entry) => entry.title === subject);

    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ title: subject, count: 1 });
    }

    return acc;
  }, []);

  subjectCounts.sort((a, b) => b.count - a.count);

  const priority = subjectCounts.map((subject, index) => {
    let priority;
    if (index === 0) {
      priority = 5;
    } else if (index === 1) {
      priority = 3;
    } else {
      priority = 1.5;
    }

    return { ...subject, priority };
  });

  //   console.log("subjectCounts with priority:", priority);
  return priority;
}

function findPriority(gotRealData) {
  const uniquePriorities = [
    ...new Set(gotRealData.map((item) => item.priority)),
  ];

  uniquePriorities.sort((a, b) => b - a);

  const highestPriority = uniquePriorities[0];
  const secondHighestPriority = uniquePriorities[1] || null;

  const priority = gotRealData.map((gotRealDataItem) => {
    let priority;
    if (gotRealDataItem?.priority === highestPriority) {
      priority = "H";
    } else if (gotRealDataItem?.priority === secondHighestPriority) {
      priority = "M";
    } else {
      priority = "L";
    }

    return { ...gotRealDataItem, priority };
  });
  return priority;
}
function findRealData(realData) {
  const pattern = ["H", "M", "H", "L", "M", "H", "L", "M", "H"];

  const groupedData = realData.reduce(
    (acc, item) => {
      acc[item.priority] = acc[item.priority] || [];
      acc[item.priority].push(item);
      return acc;
    },
    { H: [], M: [], L: [] }
  );

  const arrangedData = pattern
    .map((priority) => {
      if (groupedData[priority] && groupedData[priority].length > 0) {
        return groupedData[priority].shift();
      } else {
        return null;
      }
    })
    .filter((item) => item !== null);
  return arrangedData;
}

const findDataVoted = (data) => {
  // Adjust priority for items where downvotes are higher than upvotes
  const hDsL = data?.map((item) => {
    if (item?.votes?.upvote < item?.votes?.downvote) {
      return { ...item, priority: item.priority - 2 };
    }
    return item;
  });

  // Sort by upvotes in descending order
  const highestVoted = hDsL
    ?.filter(Boolean)
    .sort((a, b) => b.votes.upvote - a.votes.upvote);

  // Adjust priorities based on sorted order
  const finalDataPriority = highestVoted?.map((item, i) => {
    if (i === 0) {
      return { ...item, priority: item.priority + 3 };
    } else if (i === 1) {
      return { ...item, priority: item.priority + 2 };
    } else {
      // For other items with more upvotes than downvotes, increase priority by 1
      if (item.votes.upvote >= item.votes.downvote) {
        return { ...item, priority: item.priority + 1 };
      }
      return item;
    }
  });

  return finalDataPriority;
};

module.exports = {
  finalData,
  findPrioritySubject,
  findPriority,
  findRealData,
  findDataVoted,
};
