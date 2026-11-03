(function (DCLogic) {
class Component extends DCLogic {
componentDidMount() {
document.addEventListener('touchstart', function () {}, { passive: true });
}
renderVals() {
return { accent: this.props.accent ?? '#A80101' };
}
}
SKG.boot(Component);
})(SKG.DCLogic);
