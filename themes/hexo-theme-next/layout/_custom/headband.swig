<div>
	<p style="color: #333; text-align: center; height: 30px; line-height: 50px;">
		<span>毕业倒计时：</span>
		<span id="countDown"></span>
	</p>
</div>

<script type="text/javascript">
	(function(){
		graduate();
		function graduate() {
			var nowDate = Date.parse(new Date());
			var endDate = Date.parse(new Date('2021-07-01'));
			var diff = Math.abs(endDate - nowDate);

			var str = calcTime(diff);
			document.querySelector('#countDown').innerText = str;
			function calcTime (mss) {
				var days = toTwoFix(parseInt(mss / (1000 * 60 * 60 * 24)));
				var hours = toTwoFix(parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
				var minutes = toTwoFix(parseInt((mss % (1000 * 60 * 60)) / (1000 * 60)));
				var seconds = toTwoFix(parseInt((mss % (1000 * 60 * 60)) / 1000 % 60));
				// return `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒`;
				return days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒';
			};

			function toTwoFix(time) {
				return time < 10 ? '0' + time : time;
			}
		}


		setInterval(function() {
			graduate();
		},1000);
	})();
</script>