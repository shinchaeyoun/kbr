// 날짜 파싱 및 포맷팅 (간결하게)
            const itemDate = new Date(
              new Date(item.date).getTime() + 9 * 60 * 60 * 1000
            );
            const now = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
            console.log("itemDate 시간 ==>", itemDate);
            const isToday =
              itemDate.getFullYear() === now.getFullYear() &&
              itemDate.getMonth() === now.getMonth() &&
              itemDate.getDate() === now.getDate();
            const pad = (n) => String(n).padStart(2, "0");
            const [yy, mm, dd, hh, min] = [
              String(itemDate.getFullYear()).slice(-2),
              pad(itemDate.getMonth() + 1),
              pad(itemDate.getDate()),
              pad(itemDate.getHours()),
              pad(itemDate.getMinutes()),
            ];
            const dataTime = isToday
              ? `${hh}:${min}`
              : itemDate.getFullYear() === now.getFullYear()
              ? `${mm}-${dd} ${hh}:${min}`
              : `${yy}-${mm}-${dd} ${hh}:${min}`;